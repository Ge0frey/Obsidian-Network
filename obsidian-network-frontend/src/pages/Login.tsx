import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Wallet, ArrowRight, Shield, AlertCircle } from 'lucide-react'
import { useStore } from '../store'
import { cn } from '../utils/cn'
import toast from 'react-hot-toast'

export default function Login() {
  const navigate = useNavigate()
  const { setUser, setCurrentDAO } = useStore()
  const [isConnecting, setIsConnecting] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')
  const [daoId, setDaoId] = useState('')
  const [error, setError] = useState('')

  // Mock login - In production, this would connect to a real wallet
  const handleConnect = async () => {
    setError('')
    
    if (!walletAddress || !daoId) {
      setError('Please enter both wallet address and DAO ID')
      return
    }

    setIsConnecting(true)
    
    try {
      // Simulate wallet connection delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock user data
      const mockUser = {
        id: '1',
        address: walletAddress,
        daoId: daoId,
        role: 'admin' as const,
        preferences: {
          theme: 'dark' as const,
          notifications: {
            email: true,
            browser: true,
            mobile: false
          },
          defaultView: 'dashboard' as const,
          currency: 'USD' as const
        }
      }

      // Mock DAO data
      const mockDAO = {
        id: daoId,
        name: 'MoonDAO',
        address: walletAddress,
        treasuryValue: 5230000,
        treasuryValueChange24h: 3.45,
        memberCount: 1250,
        riskScore: 'low' as const,
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

      // Set user and DAO in store
      setUser(mockUser)
      setCurrentDAO(mockDAO)
      
      // Store auth token (mock)
      localStorage.setItem('auth_token', 'mock-jwt-token')
      
      toast.success('Successfully connected!')
      navigate('/app/dashboard')
    } catch (error) {
      console.error('Connection error:', error)
      setError('Failed to connect. Please try again.')
      toast.error('Connection failed')
    } finally {
      setIsConnecting(false)
    }
  }

  // For demo purposes - quick fill
  const handleDemoLogin = () => {
    setWalletAddress('mn_shield-addr_test1wvzrcdgfjgtsaxdmjxg222nf0hfhrkjw4wmhvwldhenle3a5n30qxqxqdqs7us9ppcgj8kkj7kk845g4wqxlumq53nmudypz6vafq5zkyqt5uz6u')
    setDaoId('moondao')
  }

  return (
    <div className="w-full">
      <div className="card">
        <div className="card-header text-center">
          <h1 className="card-title">Welcome to Obsidian Network</h1>
          <p className="card-description mt-2">
            Connect your wallet to access AI-powered treasury management
          </p>
        </div>
        
        <div className="card-content space-y-6">
          {/* Privacy Notice */}
          <div className="bg-secondary-500/10 border border-secondary-500/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-secondary-500 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-secondary-600 dark:text-secondary-400 mb-1">
                  Privacy-First Architecture
                </p>
                <p className="text-muted-foreground">
                  Your treasury data is protected with zero-knowledge proofs. 
                  We never expose sensitive information.
                </p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-destructive" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <div className="space-y-4">
            <div>
              <label htmlFor="wallet" className="label mb-2 block">
                Wallet Address
              </label>
              <input
                id="wallet"
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="mn_shield-addr_..."
                className="input w-full"
                disabled={isConnecting}
              />
            </div>

            <div>
              <label htmlFor="dao" className="label mb-2 block">
                DAO ID
              </label>
              <input
                id="dao"
                type="text"
                value={daoId}
                onChange={(e) => setDaoId(e.target.value)}
                placeholder="Enter your DAO identifier"
                className="input w-full"
                disabled={isConnecting}
              />
            </div>
          </div>

          {/* Connect Button */}
          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className={cn(
              'btn btn-primary btn-lg w-full',
              isConnecting && 'opacity-50 cursor-not-allowed'
            )}
          >
            {isConnecting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Connecting...
              </>
            ) : (
              <>
                <Wallet className="w-5 h-5 mr-2" />
                Connect Wallet
              </>
            )}
          </button>

          {/* Demo Button */}
          <button
            onClick={handleDemoLogin}
            className="btn btn-outline btn-md w-full"
            disabled={isConnecting}
          >
            Add Midnight walletAddress
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-muted-foreground">
                New to Obsidian?
              </span>
            </div>
          </div>

          {/* Learn More */}
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Discover how AI agents can transform your DAO treasury
            </p>
            <Link
              to="/"
              className="inline-flex items-center text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors"
            >
              Learn more <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center">
          <div className="w-10 h-10 bg-primary-500/10 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Shield className="w-5 h-5 text-primary-500" />
          </div>
          <h3 className="font-medium text-sm mb-1">Privacy Protected</h3>
          <p className="text-xs text-muted-foreground">
            Zero-knowledge proofs keep your data secure
          </p>
        </div>
        <div className="text-center">
          <div className="w-10 h-10 bg-secondary-500/10 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Wallet className="w-5 h-5 text-secondary-500" />
          </div>
          <h3 className="font-medium text-sm mb-1">Multi-Chain Support</h3>
          <p className="text-xs text-muted-foreground">
            Compatible with major blockchain networks
          </p>
        </div>
        <div className="text-center">
          <div className="w-10 h-10 bg-accent-500/10 rounded-lg flex items-center justify-center mx-auto mb-2">
            <ArrowRight className="w-5 h-5 text-accent-500" />
          </div>
          <h3 className="font-medium text-sm mb-1">Instant Access</h3>
          <p className="text-xs text-muted-foreground">
            Start optimizing your treasury immediately
          </p>
        </div>
      </div>
    </div>
  )
}
