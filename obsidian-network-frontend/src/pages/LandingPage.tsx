import { Link, useNavigate } from 'react-router-dom'
import { 
  Shield, 
  Brain, 
  Users, 
  TrendingUp, 
  Lock, 
  BarChart3,
  ArrowRight,
  CheckCircle,
  Zap,
  Globe,
  Bot
} from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '../utils/cn'

export default function LandingPage() {
  const navigate = useNavigate()

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Intelligence',
      description: 'Specialized AI agents provide expert financial guidance tailored to your DAO\'s needs',
      color: 'from-primary-500 to-primary-600'
    },
    {
      icon: Shield,
      title: 'Privacy-First Design',
      description: 'Zero-knowledge proofs ensure your sensitive data remains completely confidential',
      color: 'from-secondary-500 to-secondary-600'
    },
    {
      icon: Users,
      title: 'Cross-DAO Collaboration',
      description: 'Learn from collective intelligence without exposing individual DAO information',
      color: 'from-accent-500 to-accent-600'
    },
    {
      icon: TrendingUp,
      title: 'Optimized Performance',
      description: 'Dynamic strategies that adapt to market conditions for maximum returns',
      color: 'from-primary-600 to-accent-500'
    }
  ]

  const benefits = [
    'Risk Management & Analysis',
    'Regulatory Compliance Monitoring',
    'Yield Optimization Strategies',
    'Market Making Coordination',
    'Emergency Response Planning',
    'Privacy-Preserving Benchmarking'
  ]

  const stats = [
    { label: 'Total Value Managed', value: '$2.3B+' },
    { label: 'Active DAOs', value: '150+' },
    { label: 'AI Agents', value: '50+' },
    { label: 'Avg. Performance Gain', value: '23%' }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">O</span>
              </div>
              <span className="font-bold text-2xl">Obsidian Network</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
              <a href="#benefits" className="text-muted-foreground hover:text-foreground transition-colors">Benefits</a>
              <Link to="/login" className="btn btn-primary btn-md">
                Launch App
              </Link>
            </div>
            <button 
              onClick={() => navigate('/login')}
              className="md:hidden btn btn-primary btn-sm"
            >
              Launch
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
              Decentralized AI Agent Orchestration
              <br />
              <span className="gradient-text">for Cross-DAO Treasury Intelligence</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto text-balance">
              Privacy-first marketplace where specialized AI agents provide financial expertise to DAOs,
              enabling unprecedented collaboration while preserving complete confidentiality through zero-knowledge proofs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login" className="btn btn-primary btn-lg">
                Get Started <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <button className="btn btn-outline btn-lg">
                Watch Demo
              </button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Revolutionary Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Combining cutting-edge AI with privacy-preserving technology to transform DAO treasury management
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card hover:shadow-lg transition-shadow"
              >
                <div className="card-content">
                  <div className={cn(
                    'w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center mb-4',
                    feature.color
                  )}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How Obsidian Network Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A seamless four-phase process that transforms how DAOs manage their treasuries
            </p>
          </div>

          <div className="space-y-12">
            <motion.div 
              className="flex flex-col md:flex-row items-center gap-8"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold mr-4">
                    1
                  </div>
                  <h3 className="text-2xl font-semibold">Privacy-First Onboarding</h3>
                </div>
                <p className="text-muted-foreground">
                  Connect your DAO through zero-knowledge verification. Our AI agents analyze public data
                  to understand your profile while your sensitive information remains completely private.
                </p>
              </div>
              <div className="flex-1">
                <div className="bg-muted rounded-lg p-8 text-center">
                  <Lock className="w-16 h-16 mx-auto text-primary-500 mb-4" />
                  <p className="text-sm font-medium">Zero-Knowledge Verification</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="flex flex-col md:flex-row-reverse items-center gap-8"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-secondary-500 text-white rounded-full flex items-center justify-center font-bold mr-4">
                    2
                  </div>
                  <h3 className="text-2xl font-semibold">Collaborative Intelligence</h3>
                </div>
                <p className="text-muted-foreground">
                  Agents aggregate insights from multiple DAOs while maintaining anonymity. 
                  Learn from collective patterns without exposing individual strategies.
                </p>
              </div>
              <div className="flex-1">
                <div className="bg-muted rounded-lg p-8 text-center">
                  <Globe className="w-16 h-16 mx-auto text-secondary-500 mb-4" />
                  <p className="text-sm font-medium">Cross-DAO Analysis</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="flex flex-col md:flex-row items-center gap-8"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-accent-500 text-white rounded-full flex items-center justify-center font-bold mr-4">
                    3
                  </div>
                  <h3 className="text-2xl font-semibold">Dynamic Strategy Orchestration</h3>
                </div>
                <p className="text-muted-foreground">
                  Specialized agents collaborate to create comprehensive strategies tailored to your DAO.
                  Strategies are validated against anonymized historical data for optimal results.
                </p>
              </div>
              <div className="flex-1">
                <div className="bg-muted rounded-lg p-8 text-center">
                  <Bot className="w-16 h-16 mx-auto text-accent-500 mb-4" />
                  <p className="text-sm font-medium">Multi-Agent Collaboration</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="flex flex-col md:flex-row-reverse items-center gap-8"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                    4
                  </div>
                  <h3 className="text-2xl font-semibold">Continuous Optimization</h3>
                </div>
                <p className="text-muted-foreground">
                  Approved strategies execute through privacy-preserving smart contracts.
                  Real-time monitoring and adaptive learning ensure continuous improvement.
                </p>
              </div>
              <div className="flex-1">
                <div className="bg-muted rounded-lg p-8 text-center">
                  <BarChart3 className="w-16 h-16 mx-auto text-primary-600 mb-4" />
                  <p className="text-sm font-medium">Performance Tracking</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="section bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Transform Your DAO Treasury Management
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Access specialized expertise and collective intelligence while maintaining complete privacy
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="flex items-center space-x-3 p-4 bg-card rounded-lg"
              >
                <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0" />
                <span className="font-medium">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="bg-gradient-to-br from-primary-500/10 to-accent-500/10 rounded-2xl p-8 md:p-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Zap className="w-16 h-16 mx-auto text-primary-500 mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Revolutionize Your Treasury?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join leading DAOs leveraging AI-powered financial intelligence for optimal performance
            </p>
            <Link to="/login" className="btn btn-primary btn-lg">
              Get Started Today <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">O</span>
              </div>
              <span className="font-bold text-lg">Obsidian Network</span>
            </div>
            <p className="text-sm text-muted-foreground text-center md:text-right">
              © 2024 Obsidian Network. Privacy-First AI Financial Intelligence for DAOs.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
