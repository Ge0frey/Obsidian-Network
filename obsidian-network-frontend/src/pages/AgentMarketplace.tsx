import { useState, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  Star, 
  Users, 
  CheckCircle,
  TrendingUp,
  Brain,
  Shield,
  Activity,
  AlertTriangle,
  ArrowRight,
  Bot,
  DollarSign
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useStore } from '../store'
import { cn } from '../utils/cn'
import { Agent, AgentType } from '../types'
import toast from 'react-hot-toast'

export default function AgentMarketplace() {
  const { agents, setAgents, selectAgent } = useStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedAvailability, setSelectedAvailability] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)

  // Mock agents data
  const mockAgents: Agent[] = [
    {
      id: '1',
      name: 'RiskGuard Pro',
      type: AgentType.RISK_ANALYSIS,
      description: 'Advanced risk analysis using machine learning to identify potential threats and opportunities in your portfolio.',
      specializations: ['Portfolio Risk', 'Market Volatility', 'Correlation Analysis', 'Stress Testing'],
      rating: 4.8,
      totalClients: 89,
      successRate: 94,
      pricing: {
        model: 'performance',
        performanceFee: 2.5
      },
      reputation: {
        score: 95,
        reviews: 156,
        badges: ['Top Performer', 'Verified Expert', 'Quick Response']
      },
      availability: 'available'
    },
    {
      id: '2',
      name: 'YieldMaximizer AI',
      type: AgentType.YIELD_OPTIMIZATION,
      description: 'Sophisticated yield farming strategies across multiple protocols with automated risk management.',
      specializations: ['DeFi Yields', 'Liquidity Mining', 'Impermanent Loss Protection', 'Multi-chain'],
      rating: 4.9,
      totalClients: 124,
      successRate: 91,
      pricing: {
        model: 'hybrid',
        baseFee: 500,
        performanceFee: 1.5
      },
      reputation: {
        score: 98,
        reviews: 203,
        badges: ['Yield Master', 'Consistent Returns', 'Innovation Award']
      },
      availability: 'available'
    },
    {
      id: '3',
      name: 'ComplianceShield',
      type: AgentType.COMPLIANCE,
      description: 'Real-time regulatory compliance monitoring across multiple jurisdictions with automated reporting.',
      specializations: ['Tax Compliance', 'AML/KYC', 'Regulatory Updates', 'Audit Support'],
      rating: 4.7,
      totalClients: 67,
      successRate: 99,
      pricing: {
        model: 'fixed',
        baseFee: 1000
      },
      reputation: {
        score: 92,
        reviews: 98,
        badges: ['Compliance Expert', 'Zero Violations', 'Multi-jurisdiction']
      },
      availability: 'available'
    },
    {
      id: '4',
      name: 'CrossDAO Intel',
      type: AgentType.CROSS_DAO_INTELLIGENCE,
      description: 'Privacy-preserving cross-DAO analytics providing market insights without exposing sensitive data.',
      specializations: ['Market Trends', 'Peer Analysis', 'Pattern Recognition', 'Collective Intelligence'],
      rating: 4.6,
      totalClients: 145,
      successRate: 88,
      pricing: {
        model: 'performance',
        performanceFee: 2.0
      },
      reputation: {
        score: 90,
        reviews: 178,
        badges: ['Privacy Champion', 'Data Insights', 'Network Effect']
      },
      availability: 'busy'
    },
    {
      id: '5',
      name: 'EmergencyResponse Bot',
      type: AgentType.EMERGENCY_RESPONSE,
      description: '24/7 monitoring with instant response to market crashes, exploits, and critical events.',
      specializations: ['Crisis Management', 'Rapid Execution', 'Loss Prevention', 'Recovery Strategies'],
      rating: 4.9,
      totalClients: 102,
      successRate: 97,
      pricing: {
        model: 'hybrid',
        baseFee: 750,
        performanceFee: 3.0
      },
      reputation: {
        score: 96,
        reviews: 142,
        badges: ['Crisis Expert', 'Fast Response', 'Loss Prevention']
      },
      availability: 'available'
    },
    {
      id: '6',
      name: 'MarketMaker Plus',
      type: AgentType.MARKET_MAKING,
      description: 'Automated market making strategies with advanced algorithms for optimal liquidity provision.',
      specializations: ['AMM Strategies', 'Price Discovery', 'Liquidity Pools', 'Arbitrage'],
      rating: 4.5,
      totalClients: 56,
      successRate: 85,
      pricing: {
        model: 'performance',
        performanceFee: 3.5
      },
      reputation: {
        score: 88,
        reviews: 89,
        badges: ['Liquidity Provider', 'Market Expert']
      },
      availability: 'offline'
    }
  ]

  useEffect(() => {
    // Simulate loading agents
    setTimeout(() => {
      setAgents(mockAgents)
      setIsLoading(false)
    }, 1000)
  }, [])

  // Filter agents based on search and filters
  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.specializations.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesType = selectedType === 'all' || agent.type === selectedType
    const matchesAvailability = selectedAvailability === 'all' || agent.availability === selectedAvailability
    
    return matchesSearch && matchesType && matchesAvailability
  })

  const getAgentIcon = (type: AgentType) => {
    switch (type) {
      case AgentType.RISK_ANALYSIS: return <Shield className="w-5 h-5" />
      case AgentType.YIELD_OPTIMIZATION: return <TrendingUp className="w-5 h-5" />
      case AgentType.COMPLIANCE: return <CheckCircle className="w-5 h-5" />
      case AgentType.CROSS_DAO_INTELLIGENCE: return <Brain className="w-5 h-5" />
      case AgentType.EMERGENCY_RESPONSE: return <AlertTriangle className="w-5 h-5" />
      case AgentType.MARKET_MAKING: return <Activity className="w-5 h-5" />
      default: return <Bot className="w-5 h-5" />
    }
  }

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'text-green-500'
      case 'busy': return 'text-yellow-500'
      case 'offline': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  const handleHireAgent = (agent: Agent) => {
    selectAgent(agent)
    toast.success(`Selected ${agent.name} for your DAO`)
    // In a real app, this would open a modal or navigate to a hiring flow
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading available agents...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Agent Marketplace</h1>
        <p className="text-muted-foreground">
          Hire specialized AI agents to optimize your DAO treasury
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search agents by name, type, or specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="input"
          >
            <option value="all">All Types</option>
            {Object.values(AgentType).map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          
          <select
            value={selectedAvailability}
            onChange={(e) => setSelectedAvailability(e.target.value)}
            className="input"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="busy">Busy</option>
            <option value="offline">Offline</option>
          </select>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="card-content py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{agents.length}</p>
                <p className="text-sm text-muted-foreground">Total Agents</p>
              </div>
              <Bot className="w-8 h-8 text-primary-500 opacity-20" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-content py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{agents.filter(a => a.availability === 'available').length}</p>
                <p className="text-sm text-muted-foreground">Available Now</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500 opacity-20" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-content py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{Math.round(agents.reduce((acc, a) => acc + a.rating, 0) / agents.length * 10) / 10}</p>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
              </div>
              <Star className="w-8 h-8 text-yellow-500 opacity-20" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-content py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{Math.round(agents.reduce((acc, a) => acc + a.successRate, 0) / agents.length)}%</p>
                <p className="text-sm text-muted-foreground">Avg Success</p>
              </div>
              <TrendingUp className="w-8 h-8 text-accent-500 opacity-20" />
            </div>
          </div>
        </div>
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredAgents.map((agent, index) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="card hover:shadow-lg transition-shadow"
          >
            <div className="card-content">
              {/* Agent Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  <div className={cn(
                    'w-12 h-12 rounded-lg flex items-center justify-center',
                    'bg-gradient-to-br from-primary-500/20 to-accent-500/20'
                  )}>
                    {getAgentIcon(agent.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{agent.name}</h3>
                    <p className="text-sm text-muted-foreground">{agent.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 mb-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold">{agent.rating}</span>
                    <span className="text-sm text-muted-foreground">({agent.reputation.reviews})</span>
                  </div>
                  <span className={cn('text-sm font-medium', getAvailabilityColor(agent.availability))}>
                    {agent.availability.charAt(0).toUpperCase() + agent.availability.slice(1)}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground mb-4">{agent.description}</p>

              {/* Specializations */}
              <div className="flex flex-wrap gap-2 mb-4">
                {agent.specializations.slice(0, 3).map((spec, i) => (
                  <span key={i} className="badge badge-outline text-xs">
                    {spec}
                  </span>
                ))}
                {agent.specializations.length > 3 && (
                  <span className="badge badge-outline text-xs">
                    +{agent.specializations.length - 3} more
                  </span>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Clients</p>
                  <p className="font-semibold flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {agent.totalClients}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className="font-semibold flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {agent.successRate}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pricing</p>
                  <p className="font-semibold flex items-center">
                    <DollarSign className="w-4 h-4 mr-1" />
                    {agent.pricing.model === 'fixed' ? `$${agent.pricing.baseFee}` :
                     agent.pricing.model === 'performance' ? `${agent.pricing.performanceFee}%` :
                     `$${agent.pricing.baseFee} + ${agent.pricing.performanceFee}%`}
                  </p>
                </div>
              </div>

              {/* Badges */}
              {agent.reputation.badges.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {agent.reputation.badges.map((badge, i) => (
                    <span key={i} className="text-xs bg-primary-500/10 text-primary-600 dark:text-primary-400 px-2 py-1 rounded-full">
                      {badge}
                    </span>
                  ))}
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={() => handleHireAgent(agent)}
                disabled={agent.availability === 'offline'}
                className={cn(
                  'btn btn-primary btn-md w-full',
                  agent.availability === 'offline' && 'opacity-50 cursor-not-allowed'
                )}
              >
                {agent.availability === 'offline' ? 'Currently Offline' : 
                 agent.availability === 'busy' ? 'Join Waitlist' : 'Hire Agent'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredAgents.length === 0 && (
        <div className="text-center py-12">
          <Bot className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-lg font-medium mb-2">No agents found</p>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
}
