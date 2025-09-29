import { useState, useEffect } from 'react'
import { 
  Vote, 
  Clock, 
  CheckCircle, 
  Users,
  FileText,
  AlertTriangle,
  TrendingUp,
  Calendar,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  Minus,
  Play,
  DollarSign,
  Shield,
  Zap
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useStore } from '../store'
import { cn } from '../utils/cn'
import type { Proposal } from '../types'
import toast from 'react-hot-toast'
import { format, formatDistanceToNow } from 'date-fns'

export default function Governance() {
  const { currentDAO, addNotification } = useStore()
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'active' | 'passed' | 'rejected'>('active')
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null)
  const [showVoteModal, setShowVoteModal] = useState(false)
  const [voteType, setVoteType] = useState<'yes' | 'no' | 'abstain'>('yes')
  const [isVoting, setIsVoting] = useState(false)

  // Mock proposals
  const mockProposals: Proposal[] = [
    {
      id: '1',
      title: 'Increase Stablecoin Allocation to 60%',
      description: 'Based on AI agent recommendations and market analysis, this proposal suggests increasing our stablecoin allocation from 48% to 60% to reduce portfolio volatility during current market conditions.',
      type: 'treasury',
      status: 'active',
      votesFor: 784,
      votesAgainst: 312,
      votesAbstain: 89,
      quorum: 1000,
      deadline: new Date(Date.now() + 172800000), // 2 days from now
      impact: {
        treasuryChange: -180000,
        riskChange: 'Lower',
        estimatedAPY: 6.5
      }
    },
    {
      id: '2',
      title: 'Deploy Yield Farming Strategy on Aave V3',
      description: 'Allocate 30% of USDC holdings to Aave V3 lending pools to generate 8.2% APY. Risk assessment shows low probability of impermanent loss.',
      type: 'strategy',
      status: 'active',
      votesFor: 623,
      votesAgainst: 234,
      votesAbstain: 67,
      quorum: 1000,
      deadline: new Date(Date.now() + 259200000), // 3 days from now
      impact: {
        treasuryChange: 0,
        estimatedAPY: 8.2
      }
    },
    {
      id: '3',
      title: 'Emergency Response: Bridge Exploit Mitigation',
      description: 'Immediate action required to move funds from potentially compromised bridge contract. AI agents have detected unusual activity patterns.',
      type: 'emergency',
      status: 'executing',
      votesFor: 1124,
      votesAgainst: 56,
      votesAbstain: 23,
      quorum: 500,
      deadline: new Date(Date.now() - 3600000),
      executionTime: new Date(Date.now() - 1800000),
      impact: {
        treasuryChange: -5000,
        riskChange: 'Critical mitigation'
      }
    },
    {
      id: '4',
      title: 'Implement Cross-DAO Liquidity Pool',
      description: 'Partner with 5 other DAOs to create a shared liquidity pool for improved capital efficiency and risk sharing.',
      type: 'governance',
      status: 'passed',
      votesFor: 892,
      votesAgainst: 198,
      votesAbstain: 110,
      quorum: 1000,
      deadline: new Date(Date.now() - 86400000),
      executionTime: new Date(Date.now() + 604800000), // 1 week from now
      impact: {
        treasuryChange: -500000,
        estimatedAPY: 12.5
      }
    },
    {
      id: '5',
      title: 'Hire RiskGuard Pro AI Agent',
      description: 'Engage RiskGuard Pro for continuous portfolio risk analysis and real-time threat detection at 2.5% performance fee.',
      type: 'governance',
      status: 'rejected',
      votesFor: 423,
      votesAgainst: 687,
      votesAbstain: 90,
      quorum: 1000,
      deadline: new Date(Date.now() - 172800000),
      impact: {
        treasuryChange: -125000
      }
    }
  ]

  useEffect(() => {
    // Load proposals
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleVote = async () => {
    if (!selectedProposal) return

    setIsVoting(true)
    try {
      // In production, this would call the DAO voting contract via MCP
      // await api.castDaoVote(voteType)
      
      // Simulate vote
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast.success(`Vote cast successfully: ${voteType.toUpperCase()}`)
      addNotification({
        type: 'success',
        title: 'Vote Recorded',
        message: `Your ${voteType} vote on "${selectedProposal.title}" has been recorded on-chain`,
        actionRequired: false
      })

      setShowVoteModal(false)
      setSelectedProposal(null)
      setVoteType('yes')
    } catch (error) {
      console.error('Vote error:', error)
      toast.error('Failed to cast vote')
    } finally {
      setIsVoting(false)
    }
  }

  const getProposalIcon = (type: string) => {
    switch (type) {
      case 'treasury': return <DollarSign className="w-5 h-5" />
      case 'strategy': return <TrendingUp className="w-5 h-5" />
      case 'emergency': return <AlertTriangle className="w-5 h-5" />
      case 'governance': return <Shield className="w-5 h-5" />
      default: return <FileText className="w-5 h-5" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-primary-500'
      case 'passed': return 'text-green-500'
      case 'rejected': return 'text-red-500'
      case 'executing': return 'text-yellow-500'
      default: return 'text-gray-500'
    }
  }

  const filteredProposals = mockProposals.filter(proposal => {
    if (activeTab === 'active') return proposal.status === 'active' || proposal.status === 'executing'
    if (activeTab === 'passed') return proposal.status === 'passed'
    if (activeTab === 'rejected') return proposal.status === 'rejected'
    return false
  })

  const totalVotes = (proposal: Proposal) => 
    proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain

  const votePercentage = (votes: number, total: number) => 
    total > 0 ? Math.round((votes / total) * 100) : 0

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading governance proposals...</p>
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
            <h1 className="text-3xl font-bold mb-2">Governance</h1>
            <p className="text-muted-foreground">
              Vote on proposals to shape your DAO's future
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <button
              className="btn btn-outline btn-md"
              onClick={() => {
                toast('Create proposal feature coming soon')
              }}
            >
              <FileText className="w-4 h-4 mr-2" />
              Create Proposal
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <div className="card-content py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{mockProposals.filter(p => p.status === 'active').length}</p>
                  <p className="text-sm text-muted-foreground">Active Proposals</p>
                </div>
                <Clock className="w-8 h-8 text-primary-500 opacity-20" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <div className="card-content py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{currentDAO?.memberCount || 0}</p>
                  <p className="text-sm text-muted-foreground">Voting Members</p>
                </div>
                <Users className="w-8 h-8 text-secondary-500 opacity-20" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <div className="card-content py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">68%</p>
                  <p className="text-sm text-muted-foreground">Avg Participation</p>
                </div>
                <Vote className="w-8 h-8 text-accent-500 opacity-20" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <div className="card-content py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">85%</p>
                  <p className="text-sm text-muted-foreground">Pass Rate</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500 opacity-20" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <nav className="flex space-x-8">
            {[
              { key: 'active', label: 'Active', count: mockProposals.filter(p => p.status === 'active' || p.status === 'executing').length },
              { key: 'passed', label: 'Passed', count: mockProposals.filter(p => p.status === 'passed').length },
              { key: 'rejected', label: 'Rejected', count: mockProposals.filter(p => p.status === 'rejected').length }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={cn(
                  'pb-4 text-sm font-medium border-b-2 transition-colors flex items-center space-x-2',
                  activeTab === tab.key
                    ? 'border-primary-500 text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                )}
              >
                <span>{tab.label}</span>
                <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{tab.count}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Proposals List */}
        <div className="space-y-4">
          {filteredProposals.map((proposal, index) => (
            <motion.div
              key={proposal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card hover:shadow-lg transition-shadow"
            >
              <div className="card-content">
                {/* Proposal Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    <div className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center',
                      proposal.type === 'emergency' ? 'bg-red-500/10 text-red-500' :
                      proposal.type === 'treasury' ? 'bg-primary-500/10 text-primary-500' :
                      proposal.type === 'strategy' ? 'bg-green-500/10 text-green-500' :
                      'bg-secondary-500/10 text-secondary-500'
                    )}>
                      {getProposalIcon(proposal.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{proposal.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{proposal.description}</p>
                      
                      {/* Proposal Tags */}
                      <div className="flex items-center space-x-4 text-sm">
                        <span className={cn('font-medium', getStatusColor(proposal.status))}>
                          {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                        </span>
                        <span className="text-muted-foreground">
                          <Calendar className="w-4 h-4 inline mr-1" />
                          {proposal.status === 'active' ? 
                            `Ends ${formatDistanceToNow(proposal.deadline, { addSuffix: true })}` :
                            format(proposal.deadline, 'MMM d, yyyy')
                          }
                        </span>
                        {proposal.type === 'emergency' && (
                          <span className="text-red-500 font-medium flex items-center">
                            <Zap className="w-4 h-4 mr-1" />
                            Emergency
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Impact Summary */}
                {proposal.impact && (
                  <div className="bg-muted/50 rounded-lg p-3 mb-4">
                    <h4 className="text-sm font-medium mb-2">Projected Impact</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                      {proposal.impact.treasuryChange && (
                        <div>
                          <span className="text-muted-foreground">Treasury:</span>
                          <span className={cn(
                            'ml-2 font-medium',
                            proposal.impact.treasuryChange > 0 ? 'text-green-500' : 'text-red-500'
                          )}>
                            {proposal.impact.treasuryChange > 0 ? '+' : ''}
                            ${Math.abs(proposal.impact.treasuryChange).toLocaleString()}
                          </span>
                        </div>
                      )}
                      {proposal.impact.estimatedAPY && (
                        <div>
                          <span className="text-muted-foreground">Est. APY:</span>
                          <span className="ml-2 font-medium text-green-500">
                            +{proposal.impact.estimatedAPY}%
                          </span>
                        </div>
                      )}
                      {proposal.impact.riskChange && (
                        <div>
                          <span className="text-muted-foreground">Risk:</span>
                          <span className="ml-2 font-medium">{proposal.impact.riskChange}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Voting Progress */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Voting Progress</span>
                    <span className="font-medium">
                      {totalVotes(proposal)} / {proposal.quorum} votes (
                      {Math.round((totalVotes(proposal) / proposal.quorum) * 100)}% quorum)
                    </span>
                  </div>

                  {/* Quorum Bar */}
                  <div className="w-full bg-muted rounded-full h-2 relative">
                    <div
                      className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full"
                      style={{ width: `${Math.min((totalVotes(proposal) / proposal.quorum) * 100, 100)}%` }}
                    />
                  </div>

                  {/* Vote Distribution */}
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        <ThumbsUp className="w-4 h-4 text-green-500" />
                        <span className="font-medium">For</span>
                      </div>
                      <p className="text-xl font-bold text-green-500">
                        {votePercentage(proposal.votesFor, totalVotes(proposal))}%
                      </p>
                      <p className="text-xs text-muted-foreground">{proposal.votesFor} votes</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        <ThumbsDown className="w-4 h-4 text-red-500" />
                        <span className="font-medium">Against</span>
                      </div>
                      <p className="text-xl font-bold text-red-500">
                        {votePercentage(proposal.votesAgainst, totalVotes(proposal))}%
                      </p>
                      <p className="text-xs text-muted-foreground">{proposal.votesAgainst} votes</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        <Minus className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">Abstain</span>
                      </div>
                      <p className="text-xl font-bold text-gray-500">
                        {votePercentage(proposal.votesAbstain, totalVotes(proposal))}%
                      </p>
                      <p className="text-xs text-muted-foreground">{proposal.votesAbstain} votes</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <button className="text-sm text-primary-500 hover:text-primary-600 font-medium flex items-center">
                    View Details <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                  
                  {proposal.status === 'active' && (
                    <button
                      onClick={() => {
                        setSelectedProposal(proposal)
                        setShowVoteModal(true)
                      }}
                      className="btn btn-primary btn-sm"
                    >
                      <Vote className="w-4 h-4 mr-2" />
                      Cast Vote
                    </button>
                  )}
                  
                  {proposal.status === 'passed' && !proposal.executionTime && (
                    <button className="btn btn-secondary btn-sm">
                      <Play className="w-4 h-4 mr-2" />
                      Execute
                    </button>
                  )}
                  
                  {proposal.executionTime && (
                    <span className="text-sm text-muted-foreground">
                      Executing {format(proposal.executionTime, 'MMM d, h:mm a')}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredProposals.length === 0 && (
          <div className="text-center py-12">
            <Vote className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">No {activeTab} proposals</p>
            <p className="text-muted-foreground">Check back later for new governance activities</p>
          </div>
        )}
      </div>

      {/* Vote Modal */}
      {showVoteModal && selectedProposal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border rounded-lg shadow-xl w-full max-w-md"
          >
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">Cast Your Vote</h3>
              
              <div className="mb-6">
                <h4 className="font-medium mb-2">{selectedProposal.title}</h4>
                <p className="text-sm text-muted-foreground">
                  Your vote will be recorded on-chain and cannot be changed once submitted.
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <button
                  onClick={() => setVoteType('yes')}
                  className={cn(
                    'w-full p-3 rounded-lg border text-left transition-colors',
                    voteType === 'yes' 
                      ? 'border-green-500 bg-green-500/10' 
                      : 'border-border hover:bg-accent'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ThumbsUp className={cn(
                        'w-5 h-5',
                        voteType === 'yes' ? 'text-green-500' : 'text-muted-foreground'
                      )} />
                      <span className="font-medium">Vote For</span>
                    </div>
                    {voteType === 'yes' && <CheckCircle className="w-5 h-5 text-green-500" />}
                  </div>
                </button>

                <button
                  onClick={() => setVoteType('no')}
                  className={cn(
                    'w-full p-3 rounded-lg border text-left transition-colors',
                    voteType === 'no' 
                      ? 'border-red-500 bg-red-500/10' 
                      : 'border-border hover:bg-accent'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ThumbsDown className={cn(
                        'w-5 h-5',
                        voteType === 'no' ? 'text-red-500' : 'text-muted-foreground'
                      )} />
                      <span className="font-medium">Vote Against</span>
                    </div>
                    {voteType === 'no' && <CheckCircle className="w-5 h-5 text-red-500" />}
                  </div>
                </button>

                <button
                  onClick={() => setVoteType('abstain')}
                  className={cn(
                    'w-full p-3 rounded-lg border text-left transition-colors',
                    voteType === 'abstain' 
                      ? 'border-gray-500 bg-gray-500/10' 
                      : 'border-border hover:bg-accent'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Minus className={cn(
                        'w-5 h-5',
                        voteType === 'abstain' ? 'text-gray-500' : 'text-muted-foreground'
                      )} />
                      <span className="font-medium">Abstain</span>
                    </div>
                    {voteType === 'abstain' && <CheckCircle className="w-5 h-5 text-gray-500" />}
                  </div>
                </button>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowVoteModal(false)
                    setSelectedProposal(null)
                    setVoteType('yes')
                  }}
                  className="btn btn-outline btn-md flex-1"
                  disabled={isVoting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleVote}
                  className={cn(
                    'btn btn-primary btn-md flex-1',
                    isVoting && 'opacity-50 cursor-not-allowed'
                  )}
                  disabled={isVoting}
                >
                  {isVoting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Vote'
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
}
