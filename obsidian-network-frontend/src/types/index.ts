// DAO Types
export interface DAO {
  id: string
  name: string
  address: string
  treasuryValue: number
  treasuryValueChange24h: number
  memberCount: number
  riskScore: 'low' | 'medium' | 'high'
  portfolioAllocation: {
    stablecoins: number
    eth: number
    governanceTokens: number
    other: number
  }
  performanceRank: number
  totalDAOs: number
  lastActivity: Date
}

// Agent Types
export interface Agent {
  id: string
  name: string
  type: AgentType
  description: string
  specializations: string[]
  rating: number
  totalClients: number
  successRate: number
  pricing: {
    model: 'performance' | 'fixed' | 'hybrid'
    baseFee?: number
    performanceFee?: number
  }
  reputation: {
    score: number
    reviews: number
    badges: string[]
  }
  availability: 'available' | 'busy' | 'offline'
}

export const AgentType = {
  RISK_ANALYSIS: 'Risk Analysis',
  COMPLIANCE: 'Compliance Monitoring',
  YIELD_OPTIMIZATION: 'Yield Optimization',
  MARKET_MAKING: 'Market Making',
  CROSS_DAO_INTELLIGENCE: 'Cross-DAO Intelligence',
  EMERGENCY_RESPONSE: 'Emergency Response'
} as const

export type AgentType = typeof AgentType[keyof typeof AgentType]

// Treasury Types
export interface Treasury {
  totalValue: number
  tokens: Token[]
  transactions: Transaction[]
  strategies: Strategy[]
  performanceMetrics: PerformanceMetrics
}

export interface Token {
  id: string
  symbol: string
  name: string
  balance: number
  value: number
  price: number
  change24h: number
  allocation: number
}

export interface Transaction {
  id: string
  type: 'send' | 'receive' | 'swap' | 'stake' | 'unstake'
  status: 'pending' | 'confirmed' | 'failed'
  from: string
  to: string
  amount: number
  token: string
  timestamp: Date
  txHash?: string
  gasUsed?: number
}

export interface Strategy {
  id: string
  name: string
  type: 'yield' | 'hedging' | 'liquidity' | 'arbitrage'
  status: 'active' | 'proposed' | 'completed'
  apy?: number
  risk: 'low' | 'medium' | 'high'
  allocation: number
  performance: number
}

export interface PerformanceMetrics {
  totalReturn: number
  sharpeRatio: number
  volatility: number
  maxDrawdown: number
  winRate: number
}

// Cross-DAO Intelligence Types
export interface MarketInsight {
  id: string
  title: string
  category: 'trend' | 'risk' | 'opportunity' | 'regulatory'
  severity: 'info' | 'warning' | 'critical'
  description: string
  affectedDAOs: number
  timestamp: Date
  source: 'collective' | 'agent' | 'market'
  confidence: number
}

export interface DAOBenchmark {
  metric: string
  yourValue: number
  peerAverage: number
  topQuartile: number
  bottomQuartile: number
  trend: 'up' | 'down' | 'stable'
}

// Privacy Settings Types
export interface PrivacySettings {
  dataSharing: {
    transactionData: boolean
    portfolioComposition: boolean
    votingHistory: boolean
    performanceMetrics: boolean
  }
  anonymityLevel: 'full' | 'partial' | 'minimal'
  sharedInsights: string[]
  blacklistedDAOs: string[]
}

// Voting Types
export interface Proposal {
  id: string
  title: string
  description: string
  type: 'treasury' | 'governance' | 'strategy' | 'emergency'
  status: 'active' | 'passed' | 'rejected' | 'executing'
  votesFor: number
  votesAgainst: number
  votesAbstain: number
  quorum: number
  deadline: Date
  executionTime?: Date
  impact: {
    treasuryChange?: number
    riskChange?: string
    estimatedAPY?: number
  }
}

// Notification Types
export interface Notification {
  id: string
  type: 'alert' | 'info' | 'success' | 'warning'
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionRequired?: boolean
  action?: {
    label: string
    link: string
  }
}

// User/Session Types
export interface User {
  id: string
  address: string
  daoId: string
  role: 'admin' | 'member' | 'viewer'
  preferences: UserPreferences
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  notifications: {
    email: boolean
    browser: boolean
    mobile: boolean
  }
  defaultView: 'dashboard' | 'treasury' | 'agents'
  currency: 'USD' | 'EUR' | 'ETH' | 'BTC'
}
