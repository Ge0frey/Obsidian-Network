import { useState, useEffect } from 'react'
import { 
  Send, 
  ArrowDownLeft, 
  ArrowUpRight,
  RefreshCw,
  Shield,
  DollarSign,
  TrendingUp,
  Plus,
  Minus,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Wallet,
  Eye,
  EyeOff
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useStore } from '../store'
import { cn } from '../utils/cn'
import type { Token } from '../types'
import api from '../services/api'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

export default function Treasury() {
  const { treasury, setTreasury, addNotification } = useStore()
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'tokens' | 'transactions' | 'strategies'>('overview')
  const [showSendModal, setShowSendModal] = useState(false)
  const [selectedToken, setSelectedToken] = useState<Token | null>(null)
  const [showBalances, setShowBalances] = useState(true)

  // Send transaction form state
  const [sendForm, setSendForm] = useState({
    recipient: '',
    amount: '',
    token: 'native'
  })

  // Mock treasury data
  const mockTreasury = {
    totalValue: 5230000,
    tokens: [
      { id: '1', symbol: 'USDC', name: 'USD Coin', balance: 2510400, value: 2510400, price: 1, change24h: 0, allocation: 48 },
      { id: '2', symbol: 'ETH', name: 'Ethereum', balance: 850, value: 1673600, price: 1969, change24h: 2.3, allocation: 32 },
      { id: '3', symbol: 'MOON', name: 'MoonDAO', balance: 1046000, value: 1046000, price: 1, change24h: -1.2, allocation: 20 },
    ],
    transactions: [
      { 
        id: '1', 
        type: 'receive' as const, 
        status: 'confirmed' as const, 
        from: '0x742d...b9A0', 
        to: '0x123...456', 
        amount: 10000, 
        token: 'USDC', 
        timestamp: new Date(Date.now() - 3600000),
        txHash: '0xabc...def',
        gasUsed: 21000
      },
      { 
        id: '2', 
        type: 'send' as const, 
        status: 'confirmed' as const, 
        from: '0x123...456', 
        to: '0x789...012', 
        amount: 2.5, 
        token: 'ETH', 
        timestamp: new Date(Date.now() - 7200000),
        txHash: '0xdef...123',
        gasUsed: 45000
      },
      { 
        id: '3', 
        type: 'swap' as const, 
        status: 'pending' as const, 
        from: '0x123...456', 
        to: 'Uniswap V3', 
        amount: 5000, 
        token: 'USDC → ETH', 
        timestamp: new Date(Date.now() - 300000)
      },
    ],
    strategies: [
      {
        id: '1',
        name: 'USDC Yield Farming',
        type: 'yield' as const,
        status: 'active' as const,
        apy: 8.2,
        risk: 'low' as const,
        allocation: 30,
        performance: 6.5
      },
      {
        id: '2',
        name: 'ETH Staking',
        type: 'yield' as const,
        status: 'active' as const,
        apy: 5.7,
        risk: 'medium' as const,
        allocation: 25,
        performance: 4.2
      },
      {
        id: '3',
        name: 'Risk Hedging',
        type: 'hedging' as const,
        status: 'proposed' as const,
        risk: 'low' as const,
        allocation: 15,
        performance: 0
      }
    ],
    performanceMetrics: {
      totalReturn: 12.3,
      sharpeRatio: 1.8,
      volatility: 18.5,
      maxDrawdown: -12.3,
      winRate: 68
    }
  }

  useEffect(() => {
    // Load treasury data
    loadTreasuryData()
  }, [])

  const loadTreasuryData = async () => {
    setIsLoading(true)
    try {
      // In production, this would fetch real data from the API
      // const walletBalance = await api.getWalletBalance()
      // const transactions = await api.getTransactions('daoId')
      
      // For now, use mock data
      setTreasury(mockTreasury)
      
      // Check wallet status via MCP
      try {
        const status = await api.getWalletStatus()
        console.log('Wallet status:', status)
      } catch (error) {
        console.log('Could not connect to wallet')
      }
      
    } catch (error) {
      console.error('Error loading treasury:', error)
      toast.error('Failed to load treasury data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSend = async () => {
    if (!sendForm.recipient || !sendForm.amount) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      // Call the MCP send endpoint
      await api.sendTransaction({
        destinationAddress: sendForm.recipient,
        amount: sendForm.amount,
        token: sendForm.token === 'native' ? undefined : sendForm.token
      })

      toast.success('Transaction sent successfully!')
      addNotification({
        type: 'success',
        title: 'Transaction Sent',
        message: `Sent ${sendForm.amount} ${sendForm.token} to ${sendForm.recipient}`,
        actionRequired: false
      })

      // Reset form and close modal
      setSendForm({ recipient: '', amount: '', token: 'native' })
      setShowSendModal(false)
      setSelectedToken(null)

      // Reload treasury data
      loadTreasuryData()
    } catch (error) {
      console.error('Send error:', error)
      toast.error('Failed to send transaction')
    }
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'send': return <ArrowUpRight className="w-4 h-4" />
      case 'receive': return <ArrowDownLeft className="w-4 h-4" />
      case 'swap': return <RefreshCw className="w-4 h-4" />
      default: return <DollarSign className="w-4 h-4" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />
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
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Treasury Management</h1>
            <p className="text-muted-foreground">
              Manage your DAO assets with privacy-preserving technology
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <button
              onClick={() => setShowBalances(!showBalances)}
              className="btn btn-outline btn-sm"
            >
              {showBalances ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button
              onClick={loadTreasuryData}
              className="btn btn-outline btn-md"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
            <button
              onClick={() => setShowSendModal(true)}
              className="btn btn-primary btn-md"
            >
              <Send className="w-4 h-4 mr-2" />
              Send
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <nav className="flex space-x-8">
            {['overview', 'tokens', 'transactions', 'strategies'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={cn(
                  'pb-4 text-sm font-medium border-b-2 transition-colors',
                  activeTab === tab
                    ? 'border-primary-500 text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                )}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Total Value Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card bg-gradient-to-br from-primary-500/10 to-accent-500/10"
            >
              <div className="card-content">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Total Treasury Value</h3>
                  <Shield className="w-6 h-6 text-primary-500" />
                </div>
                <div className="text-4xl font-bold mb-2">
                  {showBalances ? `$${treasury?.totalValue.toLocaleString()}` : '••••••••'}
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="flex items-center text-green-500">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +3.45% (24h)
                  </span>
                  <span className="text-muted-foreground">
                    Updated {format(new Date(), 'h:mm a')}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(treasury?.performanceMetrics || {}).map(([key, value], index) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card"
                >
                  <div className="card-content py-4">
                    <p className="text-sm text-muted-foreground mb-1">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className={cn(
                      'text-xl font-bold',
                      value > 0 ? 'text-green-500' : value < 0 ? 'text-red-500' : ''
                    )}>
                      {value > 0 && key !== 'maxDrawdown' ? '+' : ''}{value}
                      {key.includes('Rate') || key.includes('Return') ? '%' : ''}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setActiveTab('tokens')}
                className="card hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="card-content flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold mb-1">Token Holdings</h4>
                    <p className="text-sm text-muted-foreground">
                      {treasury?.tokens.length || 0} assets
                    </p>
                  </div>
                  <Wallet className="w-8 h-8 text-primary-500 opacity-50" />
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('strategies')}
                className="card hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="card-content flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold mb-1">Active Strategies</h4>
                    <p className="text-sm text-muted-foreground">
                      {treasury?.strategies.filter(s => s.status === 'active').length || 0} running
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-secondary-500 opacity-50" />
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('transactions')}
                className="card hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="card-content flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold mb-1">Recent Activity</h4>
                    <p className="text-sm text-muted-foreground">
                      {treasury?.transactions.length || 0} transactions
                    </p>
                  </div>
                  <RefreshCw className="w-8 h-8 text-accent-500 opacity-50" />
                </div>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'tokens' && (
          <div className="space-y-4">
            {treasury?.tokens.map((token, index) => (
              <motion.div
                key={token.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card hover:shadow-lg transition-shadow"
              >
                <div className="card-content">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-full flex items-center justify-center">
                        <span className="font-bold text-sm">{token.symbol.slice(0, 2)}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold">{token.name}</h4>
                        <p className="text-sm text-muted-foreground">{token.symbol}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold">
                        {showBalances ? `${token.balance.toLocaleString()} ${token.symbol}` : '••••••'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {showBalances ? `$${token.value.toLocaleString()}` : '••••••'}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">24h Change</p>
                        <p className={cn(
                          'font-semibold flex items-center justify-end',
                          token.change24h > 0 ? 'text-green-500' : 'text-red-500'
                        )}>
                          {token.change24h > 0 ? <Plus className="w-3 h-3 mr-1" /> : <Minus className="w-3 h-3 mr-1" />}
                          {Math.abs(token.change24h)}%
                        </p>
                      </div>
                      
                      <button
                        onClick={() => {
                          setSelectedToken(token)
                          setSendForm(prev => ({ ...prev, token: token.symbol }))
                          setShowSendModal(true)
                        }}
                        className="btn btn-outline btn-sm"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                  
                  {/* Allocation Bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Portfolio Allocation</span>
                      <span className="font-medium">{token.allocation}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full"
                        style={{ width: `${token.allocation}%` }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="space-y-2">
            {treasury?.transactions.map((tx, index) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="card hover:bg-accent/50 transition-colors"
              >
                <div className="card-content py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center',
                        tx.type === 'send' ? 'bg-red-500/10 text-red-500' :
                        tx.type === 'receive' ? 'bg-green-500/10 text-green-500' :
                        'bg-primary-500/10 text-primary-500'
                      )}>
                        {getTransactionIcon(tx.type)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium capitalize">{tx.type}</span>
                          {getStatusIcon(tx.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {tx.type === 'send' ? `To ${tx.to}` : `From ${tx.from}`}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold">
                        {tx.type === 'send' ? '-' : '+'}{tx.amount} {tx.token}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(tx.timestamp, 'MMM d, h:mm a')}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'strategies' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {treasury?.strategies.map((strategy, index) => (
              <motion.div
                key={strategy.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="card"
              >
                <div className="card-content">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold">{strategy.name}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={cn(
                          'badge text-xs',
                          strategy.status === 'active' ? 'badge-default' :
                          strategy.status === 'proposed' ? 'badge-secondary' :
                          'badge-outline'
                        )}>
                          {strategy.status}
                        </span>
                        <span className={cn(
                          'text-xs font-medium',
                          strategy.risk === 'low' ? 'text-green-500' :
                          strategy.risk === 'medium' ? 'text-yellow-500' :
                          'text-red-500'
                        )}>
                          {strategy.risk.toUpperCase()} RISK
                        </span>
                      </div>
                    </div>
                    <TrendingUp className="w-5 h-5 text-primary-500" />
                  </div>
                  
                  <div className="space-y-3">
                    {strategy.apy && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Expected APY</span>
                        <span className="font-semibold text-green-500">+{strategy.apy}%</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Allocation</span>
                      <span className="font-semibold">{strategy.allocation}%</span>
                    </div>
                    
                    {strategy.performance !== 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Performance</span>
                        <span className={cn(
                          'font-semibold',
                          strategy.performance > 0 ? 'text-green-500' : 'text-red-500'
                        )}>
                          {strategy.performance > 0 ? '+' : ''}{strategy.performance}%
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {strategy.status === 'proposed' && (
                    <button className="btn btn-primary btn-sm w-full mt-4">
                      Review Proposal
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Send Modal */}
      {showSendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border rounded-lg shadow-xl w-full max-w-md"
          >
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">Send Transaction</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="label mb-2 block">Token</label>
                  <select
                    value={sendForm.token}
                    onChange={(e) => setSendForm(prev => ({ ...prev, token: e.target.value }))}
                    className="input w-full"
                  >
                    <option value="native">Native (tDUST)</option>
                    {treasury?.tokens.map(token => (
                      <option key={token.id} value={token.symbol}>
                        {token.name} ({token.symbol})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="label mb-2 block">Recipient Address</label>
                  <input
                    type="text"
                    value={sendForm.recipient}
                    onChange={(e) => setSendForm(prev => ({ ...prev, recipient: e.target.value }))}
                    placeholder="0x..."
                    className="input w-full"
                  />
                </div>
                
                <div>
                  <label className="label mb-2 block">Amount</label>
                  <input
                    type="number"
                    value={sendForm.amount}
                    onChange={(e) => setSendForm(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="0.00"
                    className="input w-full"
                  />
                  {selectedToken && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Balance: {selectedToken.balance.toLocaleString()} {selectedToken.symbol}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowSendModal(false)
                    setSelectedToken(null)
                    setSendForm({ recipient: '', amount: '', token: 'native' })
                  }}
                  className="btn btn-outline btn-md flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSend}
                  className="btn btn-primary btn-md flex-1"
                >
                  Send Transaction
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
}
