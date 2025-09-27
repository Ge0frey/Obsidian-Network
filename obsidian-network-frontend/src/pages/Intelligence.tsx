import { useState, useEffect } from 'react'
import { 
  Brain, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  Info,
  BarChart3,
  Globe,
  Shield,
  Zap,
  Eye,
  Users,
  Activity,
  ChevronUp,
  ChevronDown,
  Filter
} from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { motion } from 'framer-motion'
import { useStore } from '../store'
import { cn } from '../utils/cn'
import { MarketInsight, DAOBenchmark } from '../types'
import { format } from 'date-fns'

export default function Intelligence() {
  const { currentDAO, addNotification } = useStore()
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'trend' | 'risk' | 'opportunity' | 'regulatory'>('all')
  const [selectedTimeframe, setSelectedTimeframe] = useState<'24h' | '7d' | '30d'>('7d')
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null)

  // Mock market insights
  const mockInsights: MarketInsight[] = [
    {
      id: '1',
      title: 'Layer 2 Migration Trend Accelerating',
      category: 'trend',
      severity: 'info',
      description: 'Based on anonymized data from 89 DAOs, Layer 2 adoption has increased by 35% in the past month. Average gas savings of $125k/month reported across participating DAOs.',
      affectedDAOs: 89,
      timestamp: new Date(Date.now() - 3600000),
      source: 'collective',
      confidence: 92
    },
    {
      id: '2',
      title: 'Smart Contract Vulnerability Pattern Detected',
      category: 'risk',
      severity: 'critical',
      description: 'A vulnerability pattern affecting lending protocols has been identified. 12 DAOs have exposure to affected contracts. Immediate review recommended.',
      affectedDAOs: 12,
      timestamp: new Date(Date.now() - 7200000),
      source: 'agent',
      confidence: 98
    },
    {
      id: '3',
      title: 'New Yield Farming Opportunity',
      category: 'opportunity',
      severity: 'info',
      description: 'Emerging DeFi protocol offering 15-20% APY with audited contracts. Early adoption advantage identified through pattern analysis.',
      affectedDAOs: 34,
      timestamp: new Date(Date.now() - 14400000),
      source: 'market',
      confidence: 85
    },
    {
      id: '4',
      title: 'Regulatory Update: EU MiCA Framework',
      category: 'regulatory',
      severity: 'warning',
      description: 'New EU regulations coming into effect next quarter. DAOs with EU members should review compliance requirements.',
      affectedDAOs: 67,
      timestamp: new Date(Date.now() - 21600000),
      source: 'agent',
      confidence: 100
    },
    {
      id: '5',
      title: 'Stablecoin Allocation Shift',
      category: 'trend',
      severity: 'info',
      description: '73% of DAOs have increased stablecoin holdings by an average of 18% in response to market volatility.',
      affectedDAOs: 109,
      timestamp: new Date(Date.now() - 43200000),
      source: 'collective',
      confidence: 94
    }
  ]

  // Mock benchmark data
  const mockBenchmarks: DAOBenchmark[] = [
    { metric: 'Treasury Growth', yourValue: 12.3, peerAverage: 8.7, topQuartile: 15.2, bottomQuartile: 3.4, trend: 'up' },
    { metric: 'Risk Score', yourValue: 82, peerAverage: 75, topQuartile: 88, bottomQuartile: 65, trend: 'stable' },
    { metric: 'Diversification Index', yourValue: 0.73, peerAverage: 0.68, topQuartile: 0.82, bottomQuartile: 0.55, trend: 'up' },
    { metric: 'Yield Performance', yourValue: 8.5, peerAverage: 7.2, topQuartile: 10.3, bottomQuartile: 4.8, trend: 'down' },
    { metric: 'Member Engagement', yourValue: 68, peerAverage: 52, topQuartile: 74, bottomQuartile: 38, trend: 'up' }
  ]

  // Mock data for charts
  const daoActivityData = [
    { day: 'Mon', activeDAOs: 124, transactions: 3456 },
    { day: 'Tue', activeDAOs: 138, transactions: 4123 },
    { day: 'Wed', activeDAOs: 145, transactions: 4567 },
    { day: 'Thu', activeDAOs: 132, transactions: 3890 },
    { day: 'Fri', activeDAOs: 156, transactions: 5234 },
    { day: 'Sat', activeDAOs: 148, transactions: 4789 },
    { day: 'Sun', activeDAOs: 142, transactions: 4234 }
  ]

  const strategyPerformanceData = [
    { strategy: 'Yield Farming', adoption: 78, performance: 12.5, fullMark: 100 },
    { strategy: 'Liquidity Provision', adoption: 65, performance: 8.3, fullMark: 100 },
    { strategy: 'Staking', adoption: 89, performance: 5.7, fullMark: 100 },
    { strategy: 'Hedging', adoption: 45, performance: -2.1, fullMark: 100 },
    { strategy: 'Arbitrage', adoption: 34, performance: 15.8, fullMark: 100 }
  ]

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false)
      addNotification({
        type: 'info',
        title: 'Intelligence Report Ready',
        message: 'Latest cross-DAO insights have been compiled',
        actionRequired: false
      })
    }, 1000)
  }, [])

  const getInsightIcon = (category: string) => {
    switch (category) {
      case 'trend': return <TrendingUp className="w-5 h-5" />
      case 'risk': return <AlertTriangle className="w-5 h-5" />
      case 'opportunity': return <Zap className="w-5 h-5" />
      case 'regulatory': return <Shield className="w-5 h-5" />
      default: return <Info className="w-5 h-5" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-500 bg-red-500/10 text-red-500'
      case 'warning': return 'border-yellow-500 bg-yellow-500/10 text-yellow-500'
      default: return 'border-primary-500 bg-primary-500/10 text-primary-500'
    }
  }

  const filteredInsights = mockInsights.filter(insight => 
    selectedCategory === 'all' || insight.category === selectedCategory
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Analyzing cross-DAO patterns...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Cross-DAO Intelligence</h1>
        <p className="text-muted-foreground">
          Privacy-preserving insights from {mockInsights.reduce((acc, i) => Math.max(acc, i.affectedDAOs), 0)}+ participating DAOs
        </p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="card-content">
            <div className="flex items-center justify-between mb-2">
              <Brain className="w-8 h-8 text-primary-500 opacity-20" />
              <span className="text-sm text-green-500">+23%</span>
            </div>
            <p className="text-2xl font-bold">156</p>
            <p className="text-sm text-muted-foreground">Active DAOs</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="card-content">
            <div className="flex items-center justify-between mb-2">
              <Globe className="w-8 h-8 text-secondary-500 opacity-20" />
              <span className="text-sm text-green-500">+45%</span>
            </div>
            <p className="text-2xl font-bold">4.2M</p>
            <p className="text-sm text-muted-foreground">Weekly Transactions</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="card-content">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-8 h-8 text-accent-500 opacity-20" />
              <span className="text-sm text-muted-foreground">High</span>
            </div>
            <p className="text-2xl font-bold">94%</p>
            <p className="text-sm text-muted-foreground">Pattern Confidence</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <div className="card-content">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-primary-600 opacity-20" />
              <span className="text-sm text-yellow-500">Medium</span>
            </div>
            <p className="text-2xl font-bold">12</p>
            <p className="text-sm text-muted-foreground">Risk Alerts</p>
          </div>
        </motion.div>
      </div>

      {/* Market Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Insights List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Market Insights</h2>
            <div className="flex items-center space-x-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as any)}
                className="input input-sm"
              >
                <option value="all">All Categories</option>
                <option value="trend">Trends</option>
                <option value="risk">Risks</option>
                <option value="opportunity">Opportunities</option>
                <option value="regulatory">Regulatory</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {filteredInsights.map((insight, index) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  'card border-l-4 cursor-pointer hover:shadow-lg transition-shadow',
                  getSeverityColor(insight.severity)
                )}
                onClick={() => setExpandedInsight(expandedInsight === insight.id ? null : insight.id)}
              >
                <div className="card-content">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {getInsightIcon(insight.category)}
                        <h3 className="font-semibold">{insight.title}</h3>
                      </div>
                      <p className={cn(
                        'text-sm text-muted-foreground',
                        expandedInsight !== insight.id && 'line-clamp-2'
                      )}>
                        {insight.description}
                      </p>
                      {expandedInsight === insight.id && (
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Confidence Score</span>
                            <span className="font-medium">{insight.confidence}%</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Source</span>
                            <span className="font-medium capitalize">{insight.source}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Affected DAOs</span>
                            <span className="font-medium">{insight.affectedDAOs}</span>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-muted-foreground">
                          {format(insight.timestamp, 'MMM d, h:mm a')}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs bg-muted px-2 py-1 rounded-full">
                            {insight.affectedDAOs} DAOs affected
                          </span>
                          {expandedInsight === insight.id ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* DAO Activity Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <div className="card-header">
            <h3 className="card-title">Network Activity</h3>
            <p className="card-description">7-day DAO participation</p>
          </div>
          <div className="card-content">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={daoActivityData}>
                <defs>
                  <linearGradient id="colorDAOs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#50705a" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#50705a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="day" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
                />
                <Area
                  type="monotone"
                  dataKey="activeDAOs"
                  stroke="#50705a"
                  fillOpacity={1}
                  fill="url(#colorDAOs)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Benchmarking Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card"
      >
        <div className="card-header">
          <h3 className="card-title">Your DAO vs. Network Benchmarks</h3>
          <p className="card-description">Privacy-preserved performance comparison</p>
        </div>
        <div className="card-content">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 text-sm font-medium">Metric</th>
                  <th className="text-right py-2 text-sm font-medium">Your DAO</th>
                  <th className="text-right py-2 text-sm font-medium">Peer Average</th>
                  <th className="text-right py-2 text-sm font-medium">Top 25%</th>
                  <th className="text-center py-2 text-sm font-medium">Trend</th>
                </tr>
              </thead>
              <tbody>
                {mockBenchmarks.map((benchmark, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 text-sm">{benchmark.metric}</td>
                    <td className={cn(
                      'py-3 text-sm text-right font-semibold',
                      benchmark.yourValue > benchmark.peerAverage ? 'text-green-500' : 'text-yellow-500'
                    )}>
                      {benchmark.metric.includes('Score') || benchmark.metric.includes('Index') 
                        ? benchmark.yourValue 
                        : `${benchmark.yourValue}%`}
                    </td>
                    <td className="py-3 text-sm text-right text-muted-foreground">
                      {benchmark.metric.includes('Score') || benchmark.metric.includes('Index') 
                        ? benchmark.peerAverage 
                        : `${benchmark.peerAverage}%`}
                    </td>
                    <td className="py-3 text-sm text-right text-muted-foreground">
                      {benchmark.metric.includes('Score') || benchmark.metric.includes('Index') 
                        ? benchmark.topQuartile 
                        : `${benchmark.topQuartile}%`}
                    </td>
                    <td className="py-3 text-center">
                      {benchmark.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4 text-green-500 mx-auto" />
                      ) : benchmark.trend === 'down' ? (
                        <TrendingDown className="w-4 h-4 text-red-500 mx-auto" />
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Strategy Performance Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          <div className="card-header">
            <h3 className="card-title">Strategy Adoption Patterns</h3>
            <p className="card-description">Network-wide strategy effectiveness</p>
          </div>
          <div className="card-content">
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={strategyPerformanceData}>
                <PolarGrid className="stroke-muted" />
                <PolarAngleAxis dataKey="strategy" className="text-xs" />
                <PolarRadiusAxis className="text-xs" />
                <Radar
                  name="Adoption Rate"
                  dataKey="adoption"
                  stroke="#bf6439"
                  fill="#bf6439"
                  fillOpacity={0.3}
                />
                <Radar
                  name="Performance"
                  dataKey="performance"
                  stroke="#50705a"
                  fill="#50705a"
                  fillOpacity={0.3}
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="card"
        >
          <div className="card-header">
            <h3 className="card-title">Collective Intelligence Summary</h3>
            <p className="card-description">Key takeaways from the network</p>
          </div>
          <div className="card-content space-y-4">
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <h4 className="font-semibold text-green-600 dark:text-green-400 mb-1">
                Top Performing Strategy
              </h4>
              <p className="text-sm">
                Yield farming on Layer 2 protocols showing 15.8% average returns with 78% adoption rate
              </p>
            </div>
            
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <h4 className="font-semibold text-yellow-600 dark:text-yellow-400 mb-1">
                Emerging Risk
              </h4>
              <p className="text-sm">
                Increased correlation between governance tokens and market volatility requires hedging
              </p>
            </div>
            
            <div className="p-4 bg-primary-500/10 border border-primary-500/20 rounded-lg">
              <h4 className="font-semibold text-primary-600 dark:text-primary-400 mb-1">
                Network Consensus
              </h4>
              <p className="text-sm">
                73% of DAOs are increasing stablecoin allocations in response to market conditions
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
