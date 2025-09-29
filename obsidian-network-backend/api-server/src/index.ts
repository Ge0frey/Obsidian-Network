import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { io as SocketIOClient, Socket } from 'socket.io-client';

// Global type declarations
declare global {
  var elizaEndpointsDiscovered: boolean | undefined;
}

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(cors());
app.use(express.json());

// Create HTTP server
const server = createServer(app);

// WebSocket server for real-time updates
const wss = new WebSocketServer({ server });

// Service configurations
const ELIZA_URL = process.env.ELIZA_URL || 'http://localhost:3000';
const MCP_URL = process.env.MCP_API_URL || 'http://localhost:3001';
const AGENT_ID = process.env.AGENT_ID || 'obsidian';

// Type definitions
interface Agent {
  id: string;
  name: string;
  type: string;
  description: string;
  specializations: string[];
  rating: number;
  totalClients: number;
  successRate: number;
  pricing: {
    model: 'performance' | 'fixed' | 'hybrid';
    baseFee?: number;
    performanceFee?: number;
  };
  reputation: {
    score: number;
    reviews: number;
    badges: string[];
  };
  availability: 'available' | 'busy' | 'offline';
}

interface Proposal {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  votesFor: number;
  votesAgainst: number;
  votesAbstain: number;
  quorum: number;
  deadline: Date;
}

// Helper functions for MCP service integration
async function callMCPService(endpoint: string, method: string = 'GET', data?: any) {
  try {
    const config: any = {
      method,
      url: `${MCP_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    if (data && method !== 'GET') {
      config.data = data;
    }
    
    const response = await axios(config);
    return response.data;
  } catch (error: any) {
    console.error(`MCP Service Error (${endpoint}):`, error.message);
    throw error;
  }
}

async function discoverElizaEndpoints() {
  console.log('🔍 Discovering Eliza endpoints...');
  
  // Test basic connectivity
  try {
    const healthCheck = await axios.get(`${ELIZA_URL}`);
    console.log('✅ Eliza base URL accessible');
  } catch (error: any) {
    console.log('❌ Eliza base URL not accessible:', error.message);
  }

  // Check for common ElizaOS endpoints
  const endpointsToTest = [
    '/api/agents',
    '/api/agents/default/message',
    '/api/messaging/submit',
    '/api/chat',
    '/api/message',
    '/helloworld',
    '/agents',
    '/ping',
    '/health'
  ];

  for (const endpoint of endpointsToTest) {
    try {
      const response = await axios.get(`${ELIZA_URL}${endpoint}`, { timeout: 2000 });
      console.log(`✅ GET ${endpoint}: ${response.status} - ${typeof response.data}`);
    } catch (error: any) {
      if (error.response) {
        console.log(`📍 GET ${endpoint}: ${error.response.status} - Available but wrong method/format`);
      } else {
        console.log(`❌ GET ${endpoint}: ${error.message}`);
      }
    }
  }
}

async function getObsidianAgentId() {
  try {
    const response = await axios.get(`${ELIZA_URL}/api/agents`);
    if (response.data?.success && response.data?.data?.agents) {
      const obsidianAgent = response.data.data.agents.find(
        (agent: any) => agent.name === 'Obsidian' || agent.characterName === 'Obsidian'
      );
      if (obsidianAgent) {
        console.log(`🤖 Found Obsidian agent: ${obsidianAgent.id}`);
        return obsidianAgent.id;
      }
    }
    console.warn('⚠️ Obsidian agent not found, using default');
    return null;
  } catch (error) {
    console.warn('⚠️ Could not fetch agent list:', error);
    return null;
  }
}

// Socket.IO message types from ElizaOS documentation
enum SOCKET_MESSAGE_TYPE {
  ROOM_JOINING = 1,      // Join a channel/room
  SEND_MESSAGE = 2,      // Send a message
  MESSAGE = 3,           // Generic message
  ACK = 4,              // Acknowledgment
  THINKING = 5,         // Agent is thinking
  CONTROL = 6           // Control messages
}

// Global Socket.IO client for persistent connection
let elizaSocket: Socket | null = null;

// Helper function to generate UUID
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Initialize Socket.IO connection to Eliza
async function initializeElizaSocket(): Promise<Socket> {
  if (elizaSocket && elizaSocket.connected) {
    return elizaSocket;
  }

  console.log('🔌 Connecting to Eliza via Socket.IO...');
  
  return new Promise((resolve, reject) => {
    elizaSocket = SocketIOClient(ELIZA_URL, {
      transports: ['polling', 'websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000
    });

    elizaSocket.on('connect', () => {
      console.log('✅ Connected to Eliza Socket.IO:', elizaSocket!.id);
      resolve(elizaSocket!);
    });

    elizaSocket.on('connect_error', (error) => {
      console.error('❌ Socket.IO connection error:', error);
      reject(error);
    });

    elizaSocket.on('disconnect', (reason) => {
      console.log('🔌 Disconnected from Eliza:', reason);
    });

    // Debug: Log all events
    elizaSocket.onAny((eventName, ...args) => {
      console.log('🔔 Socket event:', eventName, args);
    });

    // Enhanced error logging
    elizaSocket.on('messageError', (error) => {
      console.error(`[${new Date().toISOString()}] ERROR: [SocketIO ${elizaSocket!.id}] Message error:`, error.error || error);
    });
  });
}

async function callElizaService(message: string, agentId?: string): Promise<any> {
  try {
    console.log(`📤 Sending message to Eliza via Socket.IO: "${message}"`);
    
    // Get the correct Obsidian agent ID
    const obsidianAgentId = await getObsidianAgentId();
    const targetAgentId = obsidianAgentId || agentId || AGENT_ID;
    const roomId = targetAgentId; // Use agent ID as room ID
    
    console.log(`🎯 Targeting agent/room: ${targetAgentId}`);
    
    // Initialize socket connection
    const socket = await initializeElizaSocket();
    
    return new Promise((resolve, reject) => {
      const messageId = generateUUID();
      const entityId = `api-client-${Date.now()}`;
      let responseReceived = false;
      
      // No timeout - wait indefinitely for response
      // const timeout = setTimeout(() => {
      //   if (!responseReceived) {
      //     responseReceived = true;
      //     reject(new Error('Timeout waiting for Eliza response'));
      //   }
      // }, 15000);
      
      // Listen for message broadcasts
      const handleMessageBroadcast = (data: any) => {
        console.log('📨 Received broadcast:', data);
        
        // Check if this message is for our room and is a response to our message
        if ((data.roomId === roomId || data.channelId === roomId) && !responseReceived) {
          responseReceived = true;
          // clearTimeout(timeout); // No timeout to clear
          
          console.log('✅ Received response from Obsidian:', data);
          
          // Clean up listener
          socket.off('messageBroadcast', handleMessageBroadcast);
          
          resolve({
            success: true,
            message: data.text || data.content || 'Response received from Obsidian',
            agentName: data.senderName || 'Obsidian',
            source: 'socketio',
            metadata: data.metadata
          });
        }
      };
      
      // Listen for broadcasts
      socket.on('messageBroadcast', handleMessageBroadcast);
      
      // First, join the room
      console.log(`🚪 Joining room: ${roomId}`);
      socket.emit('room:join', {
        channelId: roomId,
        serverId: '00000000-0000-0000-0000-000000000000',
        agentId: targetAgentId,
        userId: entityId,
        metadata: {
          source: 'api',
          requestedAt: new Date().toISOString()
        }
      });
      
      // Wait a moment for room join, then send message
      setTimeout(() => {
        console.log(`💬 Sending message to room: ${roomId}`);
        
        const serverId = '00000000-0000-0000-0000-000000000000';
        const messagePayload = {
          channelId: roomId,
          messageId,
          content: {
            text: message,
            source: 'api',
            attachments: [],
            metadata: {
              agentId: targetAgentId,
              timestamp: new Date().toISOString(),
              senderName: 'Obsidian API Client'
            }
          },
          author: {
            id: entityId,
            name: 'Obsidian API Client'
          },
          agentId: targetAgentId,
          serverId,
          routing: {
            targetChannel: roomId,
            origin: 'obsidian-api-server',
            roomId
          }
        };
        
        console.log(`[${new Date().toLocaleTimeString()}] INFO: [SocketIO ${socket.id}] Prepared message payload:`, JSON.stringify(messagePayload, null, 2));

        socket.emit('client:message', messagePayload, (ack: any) => {
          console.log('📨 client:message ack:', ack);
        });
      }, 1000);
    });
    
  } catch (error: any) {
    console.error('🚨 Eliza Socket.IO Error:', error.message);
    
    // Since we removed timeout, re-throw Socket.IO errors
    // Frontend can handle retries or fallback logic as needed
    throw new Error(`Socket.IO communication failed: ${error.message}`);
  }
}

// Fallback mock data (used when services are unavailable)
const fallbackData = {
  daos: [
    {
      id: 'moondao',
      name: 'MoonDAO',
      address: 'mn_shield-addr_test1wvzrcdgfjgtsaxdmjxg222nf0hfhrkjw4wmhvwldhenle3a5n30qxqxqdqs7us9ppcgj8kkj7kk845g4wqxlumq53nmudypz6vafq5zkyqt5uz6u',
      treasuryValue: 5230000,
      treasuryValueChange24h: 3.45,
      memberCount: 1250,
      riskScore: 'low',
      portfolioAllocation: {
        stablecoins: 48,
        eth: 32,
        governanceTokens: 20,
        other: 0
      },
      performanceRank: 23,
      totalDAOs: 150,
      lastActivity: new Date()
    }
  ],
  agents: [
    {
      id: '1',
      name: 'RiskGuard Pro',
      type: 'Risk Analysis',
      description: 'Advanced risk analysis using machine learning to identify potential threats and opportunities.',
      specializations: ['Portfolio Risk', 'Market Volatility', 'Correlation Analysis'],
      rating: 4.8,
      totalClients: 89,
      successRate: 94,
      pricing: {
        model: 'performance' as const,
        performanceFee: 2.5
      },
      reputation: {
        score: 95,
        reviews: 156,
        badges: ['Top Performer', 'Verified Expert']
      },
      availability: 'available' as const
    },
    {
      id: '2',
      name: 'YieldMaximizer AI',
      type: 'Yield Optimization',
      description: 'Sophisticated yield farming strategies across multiple protocols.',
      specializations: ['DeFi Yields', 'Liquidity Mining', 'Multi-chain'],
      rating: 4.9,
      totalClients: 124,
      successRate: 91,
      pricing: {
        model: 'hybrid' as const,
        baseFee: 500,
        performanceFee: 1.5
      },
      reputation: {
        score: 98,
        reviews: 203,
        badges: ['Yield Master', 'Innovation Award']
      },
      availability: 'available' as const
    }
  ] as Agent[],
  proposals: [
    {
      id: '1',
      title: 'Increase Stablecoin Allocation to 60%',
      description: 'Proposal to increase stablecoin allocation for risk management.',
      type: 'treasury',
      status: 'active',
      votesFor: 784,
      votesAgainst: 312,
      votesAbstain: 89,
      quorum: 1000,
      deadline: new Date(Date.now() + 172800000)
    }
  ] as Proposal[]
};

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// DAO endpoints
app.get('/daos', async (req, res) => {
  try {
    // Try to get DAO state from MCP service
    const daoState = await callMCPService('/dao/state').catch(() => null);
    
    if (daoState) {
      // Transform MCP data to frontend format
      const daos = [{
        id: daoState.id || 'moondao',
        name: daoState.name || 'MoonDAO',
        address: daoState.address || fallbackData.daos[0].address,
        treasuryValue: daoState.treasuryValue || 0,
        treasuryValueChange24h: daoState.treasuryValueChange24h || 0,
        memberCount: daoState.memberCount || 0,
        riskScore: daoState.riskScore || 'low',
        portfolioAllocation: daoState.portfolioAllocation || fallbackData.daos[0].portfolioAllocation,
        performanceRank: daoState.performanceRank || 1,
        totalDAOs: daoState.totalDAOs || 1,
        lastActivity: new Date()
      }];
      res.json(daos);
    } else {
      // Fallback to mock data
      res.json(fallbackData.daos);
    }
  } catch (error) {
    console.error('DAO list endpoint error:', error);
    res.json(fallbackData.daos);
  }
});

app.get('/daos/:id', async (req, res) => {
  try {
    // Try to get specific DAO data from MCP service
    const daoState = await callMCPService('/dao/state').catch(() => null);
    
    if (daoState && (daoState.id === req.params.id || req.params.id === 'moondao')) {
      const dao = {
        id: req.params.id,
        name: daoState.name || 'MoonDAO',
        address: daoState.address || fallbackData.daos[0].address,
        treasuryValue: daoState.treasuryValue || fallbackData.daos[0].treasuryValue,
        treasuryValueChange24h: daoState.treasuryValueChange24h || fallbackData.daos[0].treasuryValueChange24h,
        memberCount: daoState.memberCount || fallbackData.daos[0].memberCount,
        riskScore: daoState.riskScore || fallbackData.daos[0].riskScore,
        portfolioAllocation: daoState.portfolioAllocation || fallbackData.daos[0].portfolioAllocation,
        performanceRank: daoState.performanceRank || fallbackData.daos[0].performanceRank,
        totalDAOs: daoState.totalDAOs || fallbackData.daos[0].totalDAOs,
        lastActivity: new Date()
      };
      res.json(dao);
    } else {
      // Fallback to finding in mock data
      const dao = fallbackData.daos.find(d => d.id === req.params.id);
      if (!dao) {
        return res.status(404).json({ error: 'DAO not found' });
      }
      res.json(dao);
    }
  } catch (error) {
    console.error('DAO detail endpoint error:', error);
    const dao = fallbackData.daos.find(d => d.id === req.params.id);
    if (!dao) {
      return res.status(404).json({ error: 'DAO not found' });
    }
    res.json(dao);
  }
});

app.get('/daos/:id/treasury', async (req, res) => {
  try {
    // Try to get real wallet data from MCP service
    const [walletStatus, walletBalance] = await Promise.allSettled([
      callMCPService('/wallet/status'),
      callMCPService('/wallet/balance')
    ]);

    let treasury;
    
    if (walletStatus.status === 'fulfilled' && walletBalance.status === 'fulfilled') {
      // Use real data from MCP
      const status = walletStatus.value;
      const balance = walletBalance.value;
      
      treasury = {
        totalValue: balance.totalValue || 0,
        tokens: balance.tokens || [],
        transactions: [],
        strategies: [],
        performanceMetrics: {
          totalReturn: 12.3, // These could be calculated from historical data
          sharpeRatio: 1.8,
          volatility: 18.5,
          maxDrawdown: -12.3,
          winRate: 68
        }
      };
    } else {
      // Fallback to mock data if MCP service is unavailable
      console.warn('MCP service unavailable, using fallback data');
      treasury = {
        totalValue: 5230000,
        tokens: [
          { id: '1', symbol: 'USDC', name: 'USD Coin', balance: 2510400, value: 2510400, price: 1, change24h: 0, allocation: 48 },
          { id: '2', symbol: 'ETH', name: 'Ethereum', balance: 850, value: 1673600, price: 1969, change24h: 2.3, allocation: 32 },
          { id: '3', symbol: 'MOON', name: 'MoonDAO', balance: 1046000, value: 1046000, price: 1, change24h: -1.2, allocation: 20 },
        ],
        transactions: [],
        strategies: [],
        performanceMetrics: {
          totalReturn: 12.3,
          sharpeRatio: 1.8,
          volatility: 18.5,
          maxDrawdown: -12.3,
          winRate: 68
        }
      };
    }
    
    res.json(treasury);
  } catch (error) {
    console.error('Treasury endpoint error:', error);
    res.status(500).json({ error: 'Failed to fetch treasury data' });
  }
});

app.get('/daos/:id/transactions', (req, res) => {
  // Mock transactions
  const transactions = [
    { 
      id: '1', 
      type: 'receive', 
      status: 'confirmed', 
      from: '0x742d...b9A0', 
      to: '0x123...456', 
      amount: 10000, 
      token: 'USDC', 
      timestamp: new Date(Date.now() - 3600000),
      txHash: '0xabc...def',
      gasUsed: 21000
    }
  ];
  res.json(transactions);
});

app.get('/daos/:id/proposals', (req, res) => {
  res.json(fallbackData.proposals);
});

// Agent marketplace endpoints
app.get('/agents', (req, res) => {
  // For now, use fallback data for agents as they're not directly tied to blockchain
  // In the future, this could query a registry of available agents
  res.json(fallbackData.agents);
});

app.get('/agents/:id', (req, res) => {
  const agent = fallbackData.agents.find(a => a.id === req.params.id);
  if (!agent) {
    return res.status(404).json({ error: 'Agent not found' });
  }
  res.json(agent);
});

// Intelligence endpoints
app.get('/intelligence/insights', (req, res) => {
  const insights = [
    {
      id: '1',
      title: 'Layer 2 Migration Trend Accelerating',
      category: 'trend',
      severity: 'info',
      description: 'Based on anonymized data from 89 DAOs, Layer 2 adoption has increased by 35% in the past month.',
      affectedDAOs: 89,
      timestamp: new Date(),
      source: 'collective',
      confidence: 92
    }
  ];
  res.json(insights);
});

app.get('/intelligence/benchmarks/:daoId', (req, res) => {
  const benchmarks = [
    { metric: 'Treasury Growth', yourValue: 12.3, peerAverage: 8.7, topQuartile: 15.2, bottomQuartile: 3.4, trend: 'up' },
    { metric: 'Risk Score', yourValue: 82, peerAverage: 75, topQuartile: 88, bottomQuartile: 65, trend: 'stable' }
  ];
  res.json(benchmarks);
});

// Chat with Eliza/Obsidian
app.post('/agent/chat', async (req, res) => {
  try {
    const { message, agentId } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ 
        error: 'Message is required and must be a string',
        success: false 
      });
    }
    
    // Get response from Eliza (no fallbacks)
    const elizaResponse = await callElizaService(message, agentId);
    
    // Handle different possible response structures
    let responseMessage = '';
    let responseSource = elizaResponse?.source || 'eliza';
    
    if (elizaResponse?.message) {
      responseMessage = elizaResponse.message;
    } else if (elizaResponse?.response) {
      responseMessage = elizaResponse.response;
    } else if (elizaResponse?.text) {
      responseMessage = elizaResponse.text;
    } else if (elizaResponse?.data?.content) {
      responseMessage = elizaResponse.data.content;
    } else if (typeof elizaResponse === 'string') {
      responseMessage = elizaResponse;
    } else {
      console.error('Unexpected Eliza response structure:', elizaResponse);
      throw new Error('Invalid response format from Eliza');
    }
    
    return res.json({
      message: responseMessage,
      agentId: agentId || AGENT_ID,
      success: true,
      source: responseSource
    });
    
  } catch (error: any) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ 
      error: 'Failed to communicate with AI agent',
      message: error.message || 'Eliza service is unavailable',
      success: false
    });
  }
});

// MCP Service Proxy Endpoints (for frontend compatibility)
app.get('/wallet/status', async (req, res) => {
  try {
    const status = await callMCPService('/wallet/status');
    res.json(status);
  } catch (error) {
    console.error('Wallet status error:', error);
    res.status(500).json({ error: 'Failed to get wallet status' });
  }
});

app.get('/wallet/balance', async (req, res) => {
  try {
    const balance = await callMCPService('/wallet/balance');
    res.json(balance);
  } catch (error) {
    console.error('Wallet balance error:', error);
    res.status(500).json({ error: 'Failed to get wallet balance' });
  }
});

app.post('/wallet/send', async (req, res) => {
  try {
    const result = await callMCPService('/wallet/send', 'POST', req.body);
    res.json(result);
  } catch (error) {
    console.error('Wallet send error:', error);
    res.status(500).json({ error: 'Failed to send transaction' });
  }
});

app.get('/wallet/tokens/balance/:tokenName', async (req, res) => {
  try {
    const balance = await callMCPService(`/wallet/tokens/balance/${req.params.tokenName}`);
    res.json(balance);
  } catch (error) {
    console.error('Token balance error:', error);
    res.status(500).json({ error: 'Failed to get token balance' });
  }
});

app.post('/dao/open-election', async (req, res) => {
  try {
    const result = await callMCPService('/dao/open-election', 'POST', req.body);
    res.json(result);
  } catch (error) {
    console.error('Open election error:', error);
    res.status(500).json({ error: 'Failed to open election' });
  }
});

app.post('/dao/cast-vote', async (req, res) => {
  try {
    const result = await callMCPService('/dao/cast-vote', 'POST', req.body);
    res.json(result);
  } catch (error) {
    console.error('Cast vote error:', error);
    res.status(500).json({ error: 'Failed to cast vote' });
  }
});

app.get('/dao/state', async (req, res) => {
  try {
    const state = await callMCPService('/dao/state');
    res.json(state);
  } catch (error) {
    console.error('DAO state error:', error);
    res.status(500).json({ error: 'Failed to get DAO state' });
  }
});

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('New WebSocket connection');
  
  ws.on('message', (message) => {
    console.log('Received:', message.toString());
    // Handle real-time messages
  });
  
  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
  
  // Send welcome message
  ws.send(JSON.stringify({ type: 'welcome', message: 'Connected to Obsidian Network' }));
});

// Start server
// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('📤 Shutting down gracefully...');
  if (elizaSocket) {
    elizaSocket.disconnect();
  }
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('📤 Shutting down gracefully...');
  if (elizaSocket) {
    elizaSocket.disconnect();
  }
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Obsidian API Server running on port ${PORT}`);
  console.log(`📡 WebSocket server ready`);
  console.log(`🤖 Ready to connect to Eliza at ${ELIZA_URL} via Socket.IO`);
});
