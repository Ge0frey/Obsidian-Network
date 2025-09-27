import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Wallet,
  Brain,
  Vote,
  Shield,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react'
import { useStore } from '../../store'
import { cn } from '../../utils/cn'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const navItems = [
  {
    name: 'Dashboard',
    href: '/app/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Agent Marketplace',
    href: '/app/agents',
    icon: Users,
  },
  {
    name: 'Treasury',
    href: '/app/treasury',
    icon: Wallet,
  },
  {
    name: 'Intelligence',
    href: '/app/intelligence',
    icon: Brain,
  },
  {
    name: 'Governance',
    href: '/app/governance',
    icon: Vote,
  },
  {
    name: 'Privacy',
    href: '/app/privacy',
    icon: Shield,
  },
]

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { sidebarOpen, setSidebarOpen } = useStore()

  return (
    <>
      {/* Mobile Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-300 lg:hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">O</span>
            </div>
            <span className="font-bold text-xl">Obsidian</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors',
                  isActive
                    ? 'bg-primary-500 text-white'
                    : 'hover:bg-accent text-foreground'
                )
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Desktop Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-40 hidden lg:block bg-card border-r transition-all duration-300',
          sidebarOpen ? 'w-64' : 'w-20'
        )}
      >
        <div className="flex items-center justify-between p-4 border-b h-16">
          <div className={cn('flex items-center', sidebarOpen ? 'space-x-3' : '')}>
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xl">O</span>
            </div>
            {sidebarOpen && (
              <span className="font-bold text-xl animate-fade-in">Obsidian</span>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            {sidebarOpen ? (
              <ChevronLeft className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'flex items-center rounded-lg transition-colors',
                  sidebarOpen ? 'space-x-3 px-3 py-2' : 'p-3 justify-center',
                  isActive
                    ? 'bg-primary-500 text-white'
                    : 'hover:bg-accent text-foreground'
                )
              }
              title={!sidebarOpen ? item.name : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && (
                <span className="animate-fade-in">{item.name}</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* DAO Info - Only visible when expanded */}
        {sidebarOpen && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t animate-fade-in">
            <div className="text-sm text-muted-foreground">
              <div className="font-medium">MoonDAO</div>
              <div className="text-xs">Treasury: $5.23M</div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
