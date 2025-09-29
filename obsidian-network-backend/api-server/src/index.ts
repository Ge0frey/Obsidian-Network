import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Create HTTP server
const server = createServer(app);

// WebSocket server for real-time updates
const wss = new WebSocketServer({ server });

// Eliza agent configuration
const ELIZA_URL = process.env.ELIZA_URL || 'http://localhost:3000';
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

// Mock data store (in production, use a real database)
const mockData = {
  daos: [
    {
      id: 'moondao',
      name: 'MoonDAO',
      address: 'mn_shield-addr_test1sdveuqw0yalmu3juluhtrfyyav3xglyug5hfscccxmtdvgkll4fsxq9j3vs753uetn8my9s78wyhnjkzasda3p3qrldqddhel8wmuxp4vgyus895',
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
app.get('/daos', (req, res) => {
  res.json(mockData.daos);
});

app.get('/daos/:id', (req, res) => {
  const dao = mockData.daos.find(d => d.id === req.params.id);
  if (!dao) {
    return res.status(404).json({ error: 'DAO not found' });
  }
  res.json(dao);
});

app.get('/daos/:id/treasury', (req, res) => {
  // Mock treasury data
  const treasury = {
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
  res.json(treasury);
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
  res.json(mockData.proposals);
});

// Agent marketplace endpoints
app.get('/agents', (req, res) => {
  res.json(mockData.agents);
});

app.get('/agents/:id', (req, res) => {
  const agent = mockData.agents.find(a => a.id === req.params.id);
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
    
    // Mock response for now (replace with real Eliza integration later)
    const mockResponses = [
      "Hello! I'm Obsidian, your AI financial advisor. I can help you optimize your DAO treasury through privacy-preserving analytics and cross-DAO intelligence.",
      "I've analyzed your query through our secure network. Based on anonymized data from similar DAOs, I recommend reviewing your risk allocation.",
      "Your treasury is performing well! I can see opportunities for yield optimization. Would you like me to run a detailed analysis?",
      "I'm monitoring market conditions across the ecosystem. Current trends suggest increasing stablecoin allocation might be prudent.",
      "Through privacy-preserving cross-DAO intelligence, I've identified several optimization strategies that match your risk profile."
    ];
    
    const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
    
    // TODO: Replace with real Eliza integration
    // For now, try to connect to Eliza but fall back to mock
    try {
      const userId = 'user-' + Date.now();
      const channelId = 'channel-' + Date.now();
      
      const response = await axios.post(`${ELIZA_URL}/api/messaging/submit`, {
        channel_id: channelId,
        server_id: "00000000-0000-0000-0000-000000000000",
        author_id: userId,
        content: message,
        source_type: "client_chat",
        raw_message: {},
        metadata: {
          channelType: "DM",
          isDm: true,
          targetUserId: agentId || AGENT_ID
        }
      });
      
      // If Eliza responds successfully, use its response
      if (response.data?.success && response.data?.data?.content) {
        return res.json({
          message: response.data.data.content,
          agentId: agentId || AGENT_ID,
          success: true
        });
      }
    } catch (elizaError: any) {
      console.log('Eliza not available, using mock response:', elizaError.message);
    }
    
    // Use mock response
    res.json({
      message: randomResponse,
      agentId: agentId || AGENT_ID,
      success: true
    });
    
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ 
      error: 'Failed to communicate with AI agent',
      message: 'I apologize, but I am currently unable to respond. Please try again later.'
    });
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
server.listen(PORT, () => {
  console.log(`🚀 Obsidian API Server running on port ${PORT}`);
  console.log(`📡 WebSocket server ready`);
  console.log(`🤖 Connected to Eliza at ${ELIZA_URL}`);
});
