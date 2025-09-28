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
  Bot,
  ChevronDown,
  ChevronUp,
  HelpCircle
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function LandingPage() {
  const navigate = useNavigate()
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Intelligence',
      description: 'Specialized AI agents provide expert financial guidance tailored to your DAO\'s needs'
    },
    {
      icon: Shield,
      title: 'Privacy-First Design',
      description: 'Zero-knowledge proofs ensure your sensitive data remains completely confidential'
    },
    {
      icon: Users,
      title: 'Cross-DAO Collaboration',
      description: 'Learn from collective intelligence without exposing individual DAO information'
    },
    {
      icon: TrendingUp,
      title: 'Optimized Performance',
      description: 'Dynamic strategies that adapt to market conditions for maximum returns'
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

  const faqs = [
    {
      question: 'What is Obsidian Network?',
      answer: 'Obsidian Network is a privacy-first platform that connects DAOs with specialized AI agents for treasury management. Using zero-knowledge proofs, DAOs can collaborate and share insights while keeping their sensitive data completely confidential.'
    },
    {
      question: 'How does the privacy protection work?',
      answer: 'We use advanced zero-knowledge proof technology to ensure your treasury data never leaves your control. AI agents can analyze patterns and provide insights without ever seeing your actual financial information, amounts, or strategies.'
    },
    {
      question: 'What are AI agents and how do they help?',
      answer: 'AI agents are specialized programs that focus on specific aspects of treasury management like risk analysis, yield optimization, or compliance monitoring. They provide 24/7 monitoring, real-time insights, and automated strategies based on market conditions.'
    },
    {
      question: 'How do I get started?',
      answer: 'Simply connect your wallet, verify your DAO membership, and browse our marketplace of AI agents. You can start with free consultations from agents and gradually implement strategies that fit your DAO\'s risk profile and goals.'
    },
    {
      question: 'Is my DAO\'s data secure?',
      answer: 'Absolutely. We use military-grade encryption and zero-knowledge proofs. Your data is never stored in plaintext, and even we cannot access your sensitive information. All computations happen in a privacy-preserving manner.'
    },
    {
      question: 'What does it cost to use Obsidian Network?',
      answer: 'The platform itself is free to join. AI agents typically charge either a small performance fee (1-3% of gains), a fixed monthly fee, or a hybrid model. You only pay when agents deliver value to your treasury.'
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-500 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">O</span>
            </div>
              <span className="font-bold text-2xl">Obsidian Network</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
              <a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
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
      <section className="pt-32 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center px-4 py-2 bg-primary-500/10 rounded-full text-primary-600 dark:text-primary-400 text-sm font-medium mb-6">
                <Lock className="w-4 h-4 mr-2" />
                Privacy-First Treasury Management
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-8 text-balance leading-tight">
                Decentralized AI Agent Orchestration
                <br />
                <span className="text-primary-500">for Cross-DAO</span> Treasury Intelligence
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto text-balance leading-relaxed">
                Connect your DAO with specialized AI agents for intelligent treasury management. 
                Share insights and strategies while keeping your data completely private through zero-knowledge proofs.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
                <Link to="/login" className="btn btn-primary btn-lg text-lg px-8 py-4">
                  Get Started Free <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <button className="btn btn-outline btn-lg text-lg px-8 py-4">
                  <Bot className="w-5 h-5 mr-2" />
                  Explore AI Agents
                </button>
              </div>
              
              {/* Trust Indicators */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
                <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                  <Shield className="w-5 h-5 text-primary-500" />
                  <span className="font-medium">Zero-Knowledge Privacy</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                  <Brain className="w-5 h-5 text-primary-500" />
                  <span className="font-medium">Advanced AI Agents</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                  <Users className="w-5 h-5 text-primary-500" />
                  <span className="font-medium">Cross-DAO Intelligence</span>
                </div>
              </div>
            </motion.div>
          </div>
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
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card hover:shadow-md transition-all duration-300 group"
              >
                <div className="card-content text-center">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-primary-500/10 flex items-center justify-center mb-6 group-hover:bg-primary-500/20 transition-colors">
                    <feature.icon className="w-8 h-8 text-primary-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
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

          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
            <div className="space-y-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                viewport={{ once: true }}
                className="flex items-start space-x-4"
              >
                <div className="w-12 h-12 bg-primary-500 text-white rounded-2xl flex items-center justify-center font-bold text-lg flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Privacy-First Onboarding</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Connect your DAO through zero-knowledge verification. Our AI agents analyze public data
                    to understand your profile while your sensitive information remains completely private.
                  </p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                viewport={{ once: true }}
                className="flex items-start space-x-4"
              >
                <div className="w-12 h-12 bg-secondary-500 text-white rounded-2xl flex items-center justify-center font-bold text-lg flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Collaborative Intelligence</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Agents aggregate insights from multiple DAOs while maintaining anonymity. 
                    Learn from collective patterns without exposing individual strategies.
                  </p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                viewport={{ once: true }}
                className="flex items-start space-x-4"
              >
                <div className="w-12 h-12 bg-accent-500 text-white rounded-2xl flex items-center justify-center font-bold text-lg flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">AI Strategy Development</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Specialized agents collaborate to create comprehensive strategies tailored to your DAO.
                    Strategies are validated against anonymized historical data for optimal results.
                  </p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                viewport={{ once: true }}
                className="flex items-start space-x-4"
              >
                <div className="w-12 h-12 bg-primary-600 text-white rounded-2xl flex items-center justify-center font-bold text-lg flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Continuous Optimization</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Approved strategies execute through privacy-preserving smart contracts.
                    Real-time monitoring and adaptive learning ensure continuous improvement.
                  </p>
                </div>
              </motion.div>
            </div>

            <div className="flex items-center justify-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="grid grid-cols-2 gap-4 w-full max-w-md"
              >
                <div className="bg-muted/50 rounded-2xl p-6 text-center">
                  <Lock className="w-12 h-12 mx-auto text-primary-500 mb-3" />
                  <p className="text-sm font-medium">Zero-Knowledge</p>
                </div>
                <div className="bg-muted/50 rounded-2xl p-6 text-center">
                  <Globe className="w-12 h-12 mx-auto text-secondary-500 mb-3" />
                  <p className="text-sm font-medium">Cross-DAO Data</p>
                </div>
                <div className="bg-muted/50 rounded-2xl p-6 text-center">
                  <Bot className="w-12 h-12 mx-auto text-accent-500 mb-3" />
                  <p className="text-sm font-medium">AI Agents</p>
                </div>
                <div className="bg-muted/50 rounded-2xl p-6 text-center">
                  <BarChart3 className="w-12 h-12 mx-auto text-primary-600 mb-3" />
                  <p className="text-sm font-medium">Real-time Analytics</p>
                </div>
              </motion.div>
            </div>
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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="flex items-center space-x-4 p-6 bg-card rounded-2xl hover:shadow-sm transition-shadow"
              >
                <div className="w-10 h-10 bg-primary-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-primary-500" />
                </div>
                <span className="font-medium text-sm">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="section bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-primary-500/10 rounded-full text-primary-600 dark:text-primary-400 text-sm font-medium mb-6">
              <HelpCircle className="w-4 h-4 mr-2" />
              Frequently Asked Questions
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Know
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get answers to common questions about Obsidian Network and how it can transform your DAO's treasury management
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="card"
              >
                <button
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-accent/50 transition-colors rounded-lg"
                >
                  <h3 className="text-lg font-semibold pr-4">{faq.question}</h3>
                  {openFAQ === index ? (
                    <ChevronUp className="w-5 h-5 text-primary-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  )}
                </button>
                {openFAQ === index && (
                  <div className="px-6 pb-6">
                    <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="bg-primary-500/5 border border-primary-500/20 rounded-2xl p-8 md:p-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="w-20 h-20 mx-auto bg-primary-500/10 rounded-2xl flex items-center justify-center mb-6">
              <Zap className="w-10 h-10 text-primary-500" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Revolutionize Your Treasury?
            </h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Join forward-thinking DAOs leveraging AI-powered financial intelligence for optimal performance and privacy-preserving collaboration
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login" className="btn btn-primary btn-lg text-lg px-8 py-4">
                Get Started Today <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <button className="btn btn-outline btn-lg text-lg px-8 py-4">
                Schedule Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
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
