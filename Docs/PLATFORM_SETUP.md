# Obsidian Network Platform Setup Guide

## Overview
Obsidian Network is a decentralized AI agent orchestration platform for cross-DAO treasury intelligence. This guide will help you set up and run the entire platform.

## Prerequisites

### Required Software
- Node.js v22.15.1 (use nvm if needed)
- npm or yarn
- Docker
- Git

### Environment Setup
1. Clone the repository
2. Ensure all dependencies are installed

## Quick Start

### Automated Setup (Recommended)
Run the provided script to start all services:

```bash
./start-services.sh
```

This will start:
- Midnight Proof Server (Docker)
- Midnight MCP Server
- Eliza Agent (Obsidian AI)
- API Server
- Frontend Development Server

### Manual Setup

If you prefer to start services individually:

#### 1. Start Midnight Proof Server
```bash
docker run -p 6300:6300 midnightnetwork/proof-server -- 'midnight-proof-server --network testnet'
```

#### 2. Start Midnight MCP Server
```bash
cd obsidian-network-backend/services/midnight-mcp
yarn dev
```

#### 3. Start Eliza Agent
```bash
cd obsidian-network-backend/agents/Eliza-Base-Agent
npm install
npm run start -- --character character-example.json
```

#### 4. Start API Server
```bash
cd obsidian-network-backend/api-server
npm install
npm run dev
```

#### 5. Start Frontend
```bash
cd obsidian-network-frontend
npm install
npm run dev
```

## Service URLs

Once all services are running, you can access:

- **Frontend**: http://localhost:5173
- **API Server**: http://localhost:3003
- **MCP Server**: http://localhost:3001
- **Proof Server**: http://localhost:6300
- **ElizaOs** : http://localhost:3001

## Using the Platform

### 1. Access the Frontend
Navigate to http://localhost:5173 in your browser

### 2. Login
enter your wallet address and DAO ID

### 3. Explore Features
- **Dashboard**: View treasury overview and AI recommendations
- **Agent Marketplace**: Browse and hire specialized AI agents
- **Treasury**: Manage assets with Midnight Network integration
- **Intelligence**: Access cross-DAO insights
- **Governance**: Vote on proposals
- **Privacy**: Configure data sharing preferences

### 4. Chat with Obsidian
Use the chat widget in the bottom right to interact with the Obsidian AI assistant

## Key Features

### Privacy-First Architecture
- Zero-knowledge proofs protect sensitive data
- Configurable privacy settings
- Anonymous cross-DAO intelligence

### AI Agent Capabilities
- Risk Analysis
- Yield Optimization
- Compliance Monitoring
- Cross-DAO Intelligence
- Emergency Response
- Market Making

### Midnight Network Integration
- Send transactions
- Check balances
- Manage tokens
- DAO voting
- Privacy-preserving operations

## Troubleshooting

### Port Conflicts
If you see "Port already in use" errors:
```bash
# Find process using port (example for port 3000)
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### Service Connection Issues
1. Ensure all services are running
2. Check the .env files in each service directory
3. Verify network connectivity

### Frontend Not Loading
1. Clear browser cache
2. Check console for errors
3. Ensure API server is running on port 3003

## Development

### Frontend Development
The frontend uses:
- React 19 with TypeScript
- Vite for fast development
- Tailwind CSS for styling
- Framer Motion for animations
- Recharts for data visualization

### Backend Architecture
- Express.js API server
- Integration with Eliza agent
- Midnight MCP for blockchain operations
- WebSocket support for real-time updates

### Adding New Features
1. Frontend components go in `obsidian-network-frontend/src/`
2. API endpoints in `obsidian-network-backend/api-server/src/`
3. Agent capabilities in character configuration

## Security Notes

### API Keys
- Keep your OpenAI API key secure
- Never commit .env files with real keys
- Use environment variables for sensitive data


## Support

For issues or questions:
1. Check the troubleshooting section
2. Review service logs
3. Ensure all dependencies are installed correctly

