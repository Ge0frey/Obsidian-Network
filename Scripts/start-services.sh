#!/bin/bash

# Start Services Script for Obsidian Network
echo "🚀 Starting Obsidian Network Services..."

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Port $1 is already in use. Please stop the service using it."
        return 1
    fi
    return 0
}

# Check required ports
echo "📍 Checking ports..."
check_port 6300 || exit 1  # Proof server
check_port 3000 || exit 1  # MCP server
check_port 3001 || exit 1  # API server
check_port 5173 || exit 1  # Frontend dev server

# Start Midnight Proof Server (if not using external)
echo "🔐 Starting Midnight Proof Server..."
if ! docker ps | grep -q midnight-proof-server; then
    docker run -d --name midnight-proof-server -p 6300:6300 midnightnetwork/proof-server -- 'midnight-proof-server --network testnet'
    echo "✅ Proof server started"
else
    echo "✅ Proof server already running"
fi

# Start Midnight MCP Server
echo "🌙 Starting Midnight MCP Server..."
cd obsidian-network-backend/services/midnight-mcp
yarn dev &
MCP_PID=$!
cd ../../..

# Wait for MCP to start
sleep 5

# Start Eliza Agent
echo "🤖 Starting Eliza Agent (Obsidian)..."
cd obsidian-network-backend/agents/Eliza-Base-Agent
npm run start &
ELIZA_PID=$!
cd ../../..

# Wait for Eliza to start
sleep 5

# Start API Server
echo "🔧 Starting API Server..."
cd obsidian-network-backend/api-server
npm run dev &
API_PID=$!
cd ../..

# Wait for API to start
sleep 3

# Start Frontend
echo "🎨 Starting Frontend..."
cd obsidian-network-frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✨ All services started successfully!"
echo ""
echo "📌 Service URLs:"
echo "   - Frontend: http://localhost:5173"
echo "   - API Server: http://localhost:3001"
echo "   - MCP Server: http://localhost:3000"
echo "   - Proof Server: http://localhost:6300"
echo ""
echo "💡 To stop all services, press Ctrl+C"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping services..."
    kill $MCP_PID $ELIZA_PID $API_PID $FRONTEND_PID 2>/dev/null
    docker stop midnight-proof-server 2>/dev/null
    docker rm midnight-proof-server 2>/dev/null
    echo "✅ All services stopped"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup EXIT INT TERM

# Keep script running
wait
