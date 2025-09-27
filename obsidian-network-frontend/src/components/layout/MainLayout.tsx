import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import ChatWidget from '../common/ChatWidget'
import { useStore } from '../../store'
import { cn } from '../../utils/cn'

export default function MainLayout() {
  const { sidebarOpen } = useStore()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main content */}
      <div
        className={cn(
          'transition-all duration-300',
          sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
        )}
      >
        {/* Header */}
        <Header onMenuClick={() => setMobileSidebarOpen(true)} />

        {/* Page content */}
        <main className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  )
}
