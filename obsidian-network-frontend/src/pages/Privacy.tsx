import { useState, useEffect } from 'react'
import { 
  Shield, 
  Lock, 
  Eye, 
  EyeOff,
  Share2,
  Users,
  Database,
  Key,
  AlertTriangle,
  CheckCircle,
  Info,
  ToggleLeft,
  ToggleRight,
  FileText,
  BarChart3,
  Vote,
  TrendingUp,
  X,
  Brain,
  DollarSign
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useStore } from '../store'
import { cn } from '../utils/cn'
import { PrivacySettings } from '../types'
import api from '../services/api'
import toast from 'react-hot-toast'

export default function Privacy() {
  const { currentDAO, addNotification } = useStore()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [pendingChange, setPendingChange] = useState<{ setting: string; value: any } | null>(null)
  
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    dataSharing: {
      transactionData: true,
      portfolioComposition: false,
      votingHistory: false,
      performanceMetrics: true
    },
    anonymityLevel: 'partial',
    sharedInsights: ['market_trends', 'risk_patterns', 'yield_opportunities'],
    blacklistedDAOs: []
  })

  const [newBlacklistDAO, setNewBlacklistDAO] = useState('')

  useEffect(() => {
    loadPrivacySettings()
  }, [])

  const loadPrivacySettings = async () => {
    setIsLoading(true)
    try {
      // In production, this would fetch from the API
      // const settings = await api.getPrivacySettings(currentDAO?.id || '')
      
      // For now, use the default settings
      setTimeout(() => {
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Error loading privacy settings:', error)
      toast.error('Failed to load privacy settings')
      setIsLoading(false)
    }
  }

  const handleToggle = (category: string, setting: string) => {
    const newValue = !privacySettings.dataSharing[setting as keyof typeof privacySettings.dataSharing]
    
    // Show confirmation for sensitive changes
    if (setting === 'transactionData' || setting === 'portfolioComposition') {
      setPendingChange({ setting: `${category}.${setting}`, value: newValue })
      setShowConfirmModal(true)
    } else {
      updateSetting(category, setting, newValue)
    }
  }

  const updateSetting = (category: string, setting: string, value: any) => {
    if (category === 'dataSharing') {
      setPrivacySettings(prev => ({
        ...prev,
        dataSharing: {
          ...prev.dataSharing,
          [setting]: value
        }
      }))
    }
  }

  const handleAnonymityChange = (level: 'full' | 'partial' | 'minimal') => {
    setPendingChange({ setting: 'anonymityLevel', value: level })
    setShowConfirmModal(true)
  }

  const handleInsightToggle = (insight: string) => {
    setPrivacySettings(prev => ({
      ...prev,
      sharedInsights: prev.sharedInsights.includes(insight)
        ? prev.sharedInsights.filter(i => i !== insight)
        : [...prev.sharedInsights, insight]
    }))
  }

  const addBlacklistedDAO = () => {
    if (!newBlacklistDAO.trim()) return
    
    setPrivacySettings(prev => ({
      ...prev,
      blacklistedDAOs: [...prev.blacklistedDAOs, newBlacklistDAO.trim()]
    }))
    setNewBlacklistDAO('')
    toast.success('DAO added to blacklist')
  }

  const removeBlacklistedDAO = (dao: string) => {
    setPrivacySettings(prev => ({
      ...prev,
      blacklistedDAOs: prev.blacklistedDAOs.filter(d => d !== dao)
    }))
    toast.success('DAO removed from blacklist')
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // In production, this would save to the API
      // await api.updatePrivacySettings(currentDAO?.id || '', privacySettings)
      
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast.success('Privacy settings updated successfully')
      addNotification({
        type: 'success',
        title: 'Privacy Settings Updated',
        message: 'Your privacy preferences have been saved and will be applied immediately',
        actionRequired: false
      })
    } catch (error) {
      console.error('Error saving privacy settings:', error)
      toast.error('Failed to save privacy settings')
    } finally {
      setIsSaving(false)
    }
  }

  const confirmChange = () => {
    if (!pendingChange) return
    
    if (pendingChange.setting === 'anonymityLevel') {
      setPrivacySettings(prev => ({
        ...prev,
        anonymityLevel: pendingChange.value
      }))
    } else if (pendingChange.setting.startsWith('dataSharing.')) {
      const settingKey = pendingChange.setting.split('.')[1]
      updateSetting('dataSharing', settingKey, pendingChange.value)
    }
    
    setShowConfirmModal(false)
    setPendingChange(null)
    toast.success('Setting updated')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading privacy settings...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Privacy Settings</h1>
          <p className="text-muted-foreground">
            Control how your DAO data is shared while contributing to collective intelligence
          </p>
        </div>

        {/* Privacy Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-gradient-to-br from-primary-500/10 to-secondary-500/10"
        >
          <div className="card-content">
            <div className="flex items-start space-x-3">
              <Shield className="w-6 h-6 text-primary-500 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-2">Zero-Knowledge Privacy Protection</h3>
                <p className="text-sm text-muted-foreground">
                  Your data is protected using advanced cryptographic techniques. 
                  Even when sharing insights, your specific treasury details remain completely confidential. 
                  Only anonymized patterns are used for collective intelligence.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Anonymity Level */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="card-header">
            <h3 className="card-title flex items-center">
              <Key className="w-5 h-5 mr-2" />
              Anonymity Level
            </h3>
            <p className="card-description">Choose how your DAO is identified in the network</p>
          </div>
          <div className="card-content space-y-3">
            {[
              { 
                level: 'full' as const, 
                title: 'Full Anonymity', 
                description: 'Complete privacy - no identifiable information shared',
                icon: <EyeOff className="w-5 h-5" />
              },
              { 
                level: 'partial' as const, 
                title: 'Partial Anonymity', 
                description: 'Share DAO type and size category only',
                icon: <Eye className="w-5 h-5" />
              },
              { 
                level: 'minimal' as const, 
                title: 'Minimal Anonymity', 
                description: 'Share DAO name for better collaboration opportunities',
                icon: <Share2 className="w-5 h-5" />
              }
            ].map(option => (
              <button
                key={option.level}
                onClick={() => handleAnonymityChange(option.level)}
                className={cn(
                  'w-full p-4 rounded-lg border text-left transition-colors',
                  privacySettings.anonymityLevel === option.level
                    ? 'border-primary-500 bg-primary-500/10'
                    : 'border-border hover:bg-accent'
                )}
              >
                <div className="flex items-start space-x-3">
                  <div className={cn(
                    'p-2 rounded-lg',
                    privacySettings.anonymityLevel === option.level
                      ? 'bg-primary-500 text-white'
                      : 'bg-muted'
                  )}>
                    {option.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{option.title}</h4>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                  {privacySettings.anonymityLevel === option.level && (
                    <CheckCircle className="w-5 h-5 text-primary-500" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Data Sharing Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="card-header">
            <h3 className="card-title flex items-center">
              <Database className="w-5 h-5 mr-2" />
              Data Sharing Preferences
            </h3>
            <p className="card-description">Control what anonymized data contributes to collective intelligence</p>
          </div>
          <div className="card-content space-y-4">
            {[
              {
                key: 'transactionData',
                title: 'Transaction Patterns',
                description: 'Share anonymized transaction frequency and volume trends',
                icon: <BarChart3 className="w-5 h-5" />,
                sensitive: true
              },
              {
                key: 'portfolioComposition',
                title: 'Portfolio Composition',
                description: 'Share asset allocation ratios without revealing amounts',
                icon: <FileText className="w-5 h-5" />,
                sensitive: true
              },
              {
                key: 'votingHistory',
                title: 'Voting History',
                description: 'Share governance participation patterns',
                icon: <Vote className="w-5 h-5" />,
                sensitive: false
              },
              {
                key: 'performanceMetrics',
                title: 'Performance Metrics',
                description: 'Share returns and risk metrics for benchmarking',
                icon: <TrendingUp className="w-5 h-5" />,
                sensitive: false
              }
            ].map(setting => (
              <div key={setting.key} className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="p-2 bg-muted rounded-lg">
                    {setting.icon}
                  </div>
                  <div>
                    <h4 className="font-medium mb-1 flex items-center">
                      {setting.title}
                      {setting.sensitive && (
                        <Lock className="w-4 h-4 ml-2 text-muted-foreground" />
                      )}
                    </h4>
                    <p className="text-sm text-muted-foreground">{setting.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle('dataSharing', setting.key)}
                  className="ml-4"
                >
                  {privacySettings.dataSharing[setting.key as keyof typeof privacySettings.dataSharing] ? (
                    <ToggleRight className="w-10 h-6 text-primary-500" />
                  ) : (
                    <ToggleLeft className="w-10 h-6 text-muted-foreground" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Shared Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <div className="card-header">
            <h3 className="card-title flex items-center">
              <Brain className="w-5 h-5 mr-2" />
              Shared Intelligence Categories
            </h3>
            <p className="card-description">Choose which types of insights to receive and contribute to</p>
          </div>
          <div className="card-content">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { key: 'market_trends', label: 'Market Trends', icon: <TrendingUp className="w-4 h-4" /> },
                { key: 'risk_patterns', label: 'Risk Patterns', icon: <AlertTriangle className="w-4 h-4" /> },
                { key: 'yield_opportunities', label: 'Yield Opportunities', icon: <DollarSign className="w-4 h-4" /> },
                { key: 'regulatory_updates', label: 'Regulatory Updates', icon: <Shield className="w-4 h-4" /> },
                { key: 'strategy_performance', label: 'Strategy Performance', icon: <BarChart3 className="w-4 h-4" /> },
                { key: 'cross_dao_coordination', label: 'Cross-DAO Coordination', icon: <Users className="w-4 h-4" /> }
              ].map(insight => (
                <button
                  key={insight.key}
                  onClick={() => handleInsightToggle(insight.key)}
                  className={cn(
                    'p-3 rounded-lg border text-left transition-colors flex items-center space-x-2',
                    privacySettings.sharedInsights.includes(insight.key)
                      ? 'border-primary-500 bg-primary-500/10'
                      : 'border-border hover:bg-accent'
                  )}
                >
                  {insight.icon}
                  <span className="text-sm font-medium">{insight.label}</span>
                  {privacySettings.sharedInsights.includes(insight.key) && (
                    <CheckCircle className="w-4 h-4 text-primary-500 ml-auto" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Blacklisted DAOs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <div className="card-header">
            <h3 className="card-title flex items-center">
              <X className="w-5 h-5 mr-2" />
              Blacklisted DAOs
            </h3>
            <p className="card-description">DAOs you don't want to share data with or receive insights from</p>
          </div>
          <div className="card-content">
            <div className="flex space-x-2 mb-4">
              <input
                type="text"
                value={newBlacklistDAO}
                onChange={(e) => setNewBlacklistDAO(e.target.value)}
                placeholder="Enter DAO ID or address"
                className="input flex-1"
                onKeyPress={(e) => e.key === 'Enter' && addBlacklistedDAO()}
              />
              <button
                onClick={addBlacklistedDAO}
                className="btn btn-outline btn-md"
                disabled={!newBlacklistDAO.trim()}
              >
                Add
              </button>
            </div>
            
            {privacySettings.blacklistedDAOs.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No blacklisted DAOs
              </p>
            ) : (
              <div className="space-y-2">
                {privacySettings.blacklistedDAOs.map((dao, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <span className="text-sm font-mono">{dao}</span>
                    <button
                      onClick={() => removeBlacklistedDAO(dao)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={cn(
              'btn btn-primary btn-lg',
              isSaving && 'opacity-50 cursor-not-allowed'
            )}
          >
            {isSaving ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Save Privacy Settings
              </>
            )}
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border rounded-lg shadow-xl w-full max-w-md"
          >
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-yellow-500/10 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-yellow-500" />
                </div>
                <h3 className="text-xl font-semibold">Confirm Privacy Change</h3>
              </div>
              
              <p className="text-muted-foreground mb-6">
                This change will affect how your DAO's data is shared with the network. 
                Are you sure you want to proceed?
              </p>

              <div className="bg-muted rounded-lg p-4 mb-6">
                <p className="text-sm">
                  <span className="font-medium">Change:</span> {pendingChange?.setting}
                </p>
                <p className="text-sm mt-1">
                  <span className="font-medium">New Value:</span> {String(pendingChange?.value)}
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowConfirmModal(false)
                    setPendingChange(null)
                  }}
                  className="btn btn-outline btn-md flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmChange}
                  className="btn btn-primary btn-md flex-1"
                >
                  Confirm Change
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
}
