import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { DAO, Agent, User, Notification, Treasury } from '../types'

interface AppState {
  // User State
  user: User | null
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  logout: () => void

  // DAO State
  currentDAO: DAO | null
  daos: DAO[]
  setCurrentDAO: (dao: DAO) => void
  setDAOs: (daos: DAO[]) => void

  // Treasury State
  treasury: Treasury | null
  setTreasury: (treasury: Treasury) => void

  // Agent State
  agents: Agent[]
  selectedAgent: Agent | null
  setAgents: (agents: Agent[]) => void
  selectAgent: (agent: Agent | null) => void

  // Notifications
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  markAsRead: (id: string) => void
  clearNotifications: () => void

  // UI State
  sidebarOpen: boolean
  theme: 'light' | 'dark' | 'system'
  setSidebarOpen: (open: boolean) => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void

  // Chat State
  isChatOpen: boolean
  chatMessages: Array<{ role: 'user' | 'assistant'; content: string; timestamp: Date }>
  setChatOpen: (open: boolean) => void
  addChatMessage: (message: { role: 'user' | 'assistant'; content: string }) => void
  clearChat: () => void
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // User State
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      logout: () => set({ 
        user: null, 
        isAuthenticated: false, 
        currentDAO: null,
        treasury: null 
      }),

      // DAO State
      currentDAO: null,
      daos: [],
      setCurrentDAO: (dao) => set({ currentDAO: dao }),
      setDAOs: (daos) => set({ daos }),

      // Treasury State
      treasury: null,
      setTreasury: (treasury) => set({ treasury }),

      // Agent State
      agents: [],
      selectedAgent: null,
      setAgents: (agents) => set({ agents }),
      selectAgent: (agent) => set({ selectedAgent: agent }),

      // Notifications
      notifications: [],
      addNotification: (notification) => set((state) => ({
        notifications: [
          {
            ...notification,
            id: Math.random().toString(36).substr(2, 9),
            timestamp: new Date(),
            read: false,
          },
          ...state.notifications,
        ],
      })),
      markAsRead: (id) => set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        ),
      })),
      clearNotifications: () => set({ notifications: [] }),

      // UI State
      sidebarOpen: true,
      theme: 'dark',
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setTheme: (theme) => set({ theme }),

      // Chat State
      isChatOpen: false,
      chatMessages: [],
      setChatOpen: (open) => set({ isChatOpen: open }),
      addChatMessage: (message) => set((state) => ({
        chatMessages: [
          ...state.chatMessages,
          { ...message, timestamp: new Date() },
        ],
      })),
      clearChat: () => set({ chatMessages: [] }),
    }),
    {
      name: 'obsidian-network-store',
      partialize: (state) => ({
        user: state.user,
        theme: state.theme,
        currentDAO: state.currentDAO,
      }),
    }
  )
)

// Selectors
export const useUser = () => useStore((state) => state.user)
export const useDAO = () => useStore((state) => state.currentDAO)
export const useTreasury = () => useStore((state) => state.treasury)
export const useAgents = () => useStore((state) => state.agents)
export const useNotifications = () => useStore((state) => state.notifications)
export const useTheme = () => useStore((state) => state.theme)
export const useChat = () => useStore((state) => ({
  isOpen: state.isChatOpen,
  messages: state.chatMessages,
  setOpen: state.setChatOpen,
  addMessage: state.addChatMessage,
  clear: state.clearChat,
}))
