import axios from 'axios'
import type { AxiosInstance } from 'axios'
import type { DAO, Agent, Treasury, MarketInsight, Proposal, Transaction } from '../types'

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'
const MCP_API_URL = import.meta.env.VITE_MCP_API_URL || 'http://localhost:3000'

class ApiService {
  private api: AxiosInstance
  private mcpApi: AxiosInstance

  constructor() {
    // Main API instance
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // MCP API instance for Midnight tools
    this.mcpApi = axios.create({
      baseURL: MCP_API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor for auth
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('auth_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    this.mcpApi.interceptors.request.use((config) => {
      const token = localStorage.getItem('auth_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })
  }

  // DAO Management
  async getDAO(daoId: string): Promise<DAO> {
    const response = await this.api.get(`/daos/${daoId}`)
    return response.data
  }

  async getDAOList(): Promise<DAO[]> {
    const response = await this.api.get('/daos')
    return response.data
  }

  // Agent Marketplace
  async getAgents(filters?: {
    type?: string
    availability?: string
    minRating?: number
  }): Promise<Agent[]> {
    const response = await this.api.get('/agents', { params: filters })
    return response.data
  }

  async getAgent(agentId: string): Promise<Agent> {
    const response = await this.api.get(`/agents/${agentId}`)
    return response.data
  }

  async hireAgent(agentId: string, config: any): Promise<any> {
    const response = await this.api.post(`/agents/${agentId}/hire`, config)
    return response.data
  }

  // Treasury Management
  async getTreasury(daoId: string): Promise<Treasury> {
    const response = await this.api.get(`/daos/${daoId}/treasury`)
    return response.data
  }

  async getTransactions(daoId: string): Promise<Transaction[]> {
    const response = await this.api.get(`/daos/${daoId}/transactions`)
    return response.data
  }

  // Cross-DAO Intelligence
  async getMarketInsights(): Promise<MarketInsight[]> {
    const response = await this.api.get('/intelligence/insights')
    return response.data
  }

  async getBenchmarks(daoId: string): Promise<any> {
    const response = await this.api.get(`/intelligence/benchmarks/${daoId}`)
    return response.data
  }

  // Governance
  async getProposals(daoId: string): Promise<Proposal[]> {
    const response = await this.api.get(`/daos/${daoId}/proposals`)
    return response.data
  }

  async vote(proposalId: string, vote: 'yes' | 'no' | 'abstain'): Promise<any> {
    const response = await this.api.post(`/proposals/${proposalId}/vote`, { vote })
    return response.data
  }

  // Midnight MCP Tools Integration (proxied through backend)
  async getWalletStatus(): Promise<any> {
    const response = await this.api.get('/wallet/status')
    return response.data
  }

  async getWalletBalance(): Promise<any> {
    const response = await this.api.get('/wallet/balance')
    return response.data
  }

  async sendTransaction(data: {
    destinationAddress: string
    amount: string
    token?: string
  }): Promise<any> {
    const response = await this.api.post('/wallet/send', data)
    return response.data
  }

  async getTokenBalance(tokenName: string): Promise<any> {
    const response = await this.api.get(`/wallet/tokens/balance/${tokenName}`)
    return response.data
  }

  async openDaoElection(electionId: string): Promise<any> {
    const response = await this.api.post('/dao/open-election', { electionId })
    return response.data
  }

  async castDaoVote(voteType: 'yes' | 'no' | 'absence'): Promise<any> {
    const response = await this.api.post('/dao/cast-vote', { voteType })
    return response.data
  }

  async getDaoState(): Promise<any> {
    const response = await this.api.get('/dao/state')
    return response.data
  }

  // Chat with Eliza/Obsidian
  async sendMessage(message: string): Promise<any> {
    const response = await this.api.post('/agent/chat', { 
      message,
      agentId: 'obsidian'
    })
    return response.data
  }

  // Privacy Settings
  async getPrivacySettings(daoId: string): Promise<any> {
    const response = await this.api.get(`/daos/${daoId}/privacy`)
    return response.data
  }

  async updatePrivacySettings(daoId: string, settings: any): Promise<any> {
    const response = await this.api.put(`/daos/${daoId}/privacy`, settings)
    return response.data
  }
}

export const api = new ApiService()
export default api
