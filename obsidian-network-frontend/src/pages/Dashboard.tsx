import { useEffect, useState } from 'react'
import { 
  TrendingUp, 
  AlertTriangle, 
  DollarSign,
  Users,
  Activity,
  Shield,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Bot,
  Brain,
  Zap,
  Wallet
} from 'lucide-react'
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store'
import { cn } from '../utils/cn'
import { format } from 'date-fns'

export default function Dashboard() {
  const navigate = useNavigate()
  const { currentDAO, addNotification } = useStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading treasury data
    setTimeout(() => {
      setIsLoading(false)
      // Add a welcome notification
      addNotification({
        type: 'info',
        title: 'Welcome to Obsidian Network',
        message: 'Your AI agents are ready to optimize your treasury',
        actionRequired: false
      })
    }, 1000)
  }, [])

  // Mock data for charts
  const performanceData = [
    { month: 'Jan', value: 4800000 },
    { month: 'Feb', value: 4950000 },
    { month: 'Mar', value: 4900000 },
    { month: 'Apr', value: 5100000 },
    { month: 'May', value: 5230000 },
    { month: 'Jun', value: 5400000 },
  ]

  const allocationData = [
    { name: 'Stablecoins', value: 48, color: '#50705a' },
    { name: 'ETH', value: 32, color: '#bf6439' },
    { name: 'Governance', value: 20, color: '#e87e1f' },
  ]

  const riskMetrics = [
    { label: 'Sharpe Ratio', value: 1.8, status: 'good' },
    { label: 'Max Drawdown', value: -12.3, status: 'warning' },
    { label: 'Volatility', value: 18.5, status: 'neutral' },
    { label: 'Win Rate', value: 68, status: 'good' },
  ]

  const agentRecommendations = [
    {
      id: '1',
      agent: 'Risk Analyzer',
      type: 'warning',
      message: 'High correlation detected between ETH and governance tokens. Consider diversification.',
      impact: 'Risk reduction: -15%',
      action: 'Review Strategy'
    },
    {
      id: '2',
      agent: 'Yield Optimizer',
      type: 'opportunity',
      message: 'New yield farming opportunity on Aave V3 with 8.2% APY for USDC.',
      impact: 'Potential gain: +$42k/year',
      action: 'Explore Opportunity'
    },
    {
      id: '3',
      agent: 'Cross-DAO Intel',
      type: 'info',
      message: '73% of similar DAOs have increased stablecoin allocation this week.',
      impact: 'Market trend indicator',
      action: 'View Analysis'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-500'
      case 'warning': return 'text-yellow-500'
      case 'danger': return 'text-red-500'
      default: return 'text-muted-foreground'
    }
  }

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'opportunity': return <TrendingUp className="w-5 h-5 text-green-500" />
      default: return <Brain className="w-5 h-5 text-primary-500" />
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading treasury data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Treasury Dashboard</h1>
          <p className="text-muted-foreground">
            {currentDAO?.name || 'Your DAO'} • Last updated: {format(new Date(), 'MMM d, h:mm a')}
          </p>
        </div>
        <div className="flex space-x-3 mt-4 md:mt-0">
          <button 
            onClick={() => navigate('/app/agents')}
            className="btn btn-outline btn-md"
          >
            <Bot className="w-4 h-4 mr-2" />
            View Agents
          </button>
          <button 
            onClick={() => navigate('/app/treasury')}
            className="btn btn-primary btn-md"
          >
            <Wallet className="w-4 h-4 mr-2" />
            Manage Treasury
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="card"
        >
          <div className="card-content">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-primary-500/10 rounded-lg">
                <DollarSign className="w-5 h-5 text-primary-500" />
              </div>
              <span className={cn(
                'text-sm font-medium flex items-center',
                currentDAO?.treasuryValueChange24h! > 0 ? 'text-green-500' : 'text-red-500'
              )}>
                {currentDAO?.treasuryValueChange24h! > 0 ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                {Math.abs(currentDAO?.treasuryValueChange24h || 0)}%
              </span>
            </div>
            <h3 className="text-2xl font-bold">$5,380</h3>
            <p className="text-sm text-muted-foreground mt-1">Total Treasury Value</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="card"
        >
          <div className="card-content">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-secondary-500/10 rounded-lg">
                <Shield className="w-5 h-5 text-secondary-500" />
              </div>
              <span className={cn(
                'text-sm font-medium',
                currentDAO?.riskScore === 'low' ? 'text-green-500' :
                currentDAO?.riskScore === 'medium' ? 'text-yellow-500' : 'text-red-500'
              )}>
                {currentDAO?.riskScore?.toUpperCase()}
              </span>
            </div>
            <h3 className="text-2xl font-bold">Score: 82/100</h3>
            <p className="text-sm text-muted-foreground mt-1">Risk Assessment</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="card"
        >
          <div className="card-content">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-accent-500/10 rounded-lg">
                <Users className="w-5 h-5 text-accent-500" />
              </div>
              <span className="text-sm font-medium text-green-500 flex items-center">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                12%
              </span>
            </div>
            <h3 className="text-2xl font-bold">{currentDAO?.memberCount || 0}</h3>
            <p className="text-sm text-muted-foreground mt-1">Active Members</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="card"
        >
          <div className="card-content">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-primary-600/10 rounded-lg">
                <Activity className="w-5 h-5 text-primary-600" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                Top {Math.round((currentDAO?.performanceRank! / currentDAO?.totalDAOs!) * 100)}%
              </span>
            </div>
            <h3 className="text-2xl font-bold">#{currentDAO?.performanceRank || 0}</h3>
            <p className="text-sm text-muted-foreground mt-1">Performance Rank</p>
          </div>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="lg:col-span-2 card"
        >
          <div className="card-header">
            <h3 className="card-title">Treasury Performance</h3>
            <p className="card-description">6-month treasury value trend</p>
          </div>
          <div className="card-content">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#bf6439" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#bf6439" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                <Tooltip 
                  formatter={(value: any) => [`$${value.toLocaleString()}`, 'Value']}
                  contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#bf6439"
                  fillOpacity={1}
                  fill="url(#colorValue)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Allocation Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="card"
        >
          <div className="card-header">
            <h3 className="card-title">Portfolio Allocation</h3>
            <p className="card-description">Current asset distribution</p>
          </div>
          <div className="card-content">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => [`${value}%`, '']}
                  contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {allocationData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Risk Metrics & AI Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Metrics */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="card"
        >
          <div className="card-header">
            <h3 className="card-title flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Risk Metrics
            </h3>
            <p className="card-description">Key performance indicators</p>
          </div>
          <div className="card-content space-y-4">
            {riskMetrics.map((metric, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium">{metric.label}</span>
                <div className="flex items-center space-x-2">
                  <span className={cn('text-sm font-bold', getStatusColor(metric.status))}>
                    {metric.value > 0 ? '+' : ''}{metric.value}{metric.label.includes('Rate') ? '%' : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* AI Agent Recommendations */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
          className="card"
        >
          <div className="card-header">
            <h3 className="card-title flex items-center">
              <Zap className="w-5 h-5 mr-2" />
              AI Agent Recommendations
            </h3>
            <p className="card-description">Real-time insights from your agents</p>
          </div>
          <div className="card-content space-y-3">
            {agentRecommendations.map((rec) => (
              <div key={rec.id} className="border rounded-lg p-3 hover:bg-accent/50 transition-colors cursor-pointer">
                <div className="flex items-start space-x-3">
                  {getRecommendationIcon(rec.type)}
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-1">{rec.agent}</p>
                    <p className="text-sm text-muted-foreground">{rec.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{rec.impact}</p>
                  </div>
                </div>
                <button className="text-xs text-primary-500 hover:text-primary-600 mt-2">
                  {rec.action} →
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
