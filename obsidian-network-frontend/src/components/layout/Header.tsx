import { Menu, Bell, Moon, Sun, Settings, LogOut, User } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useStore } from '../../store'
import { cn } from '../../utils/cn'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'

interface HeaderProps {
  onMenuClick: () => void
}

export default function Header({ onMenuClick }: HeaderProps) {
  const navigate = useNavigate()
  const { theme, setTheme, user, logout, notifications, markAsRead } = useStore()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const notificationRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter(n => !n.read).length

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleThemeToggle = () => {
    const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system']
    const currentIndex = themes.indexOf(theme)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getThemeIcon = () => {
    if (theme === 'system') return <Settings className="w-5 h-5" />
    if (theme === 'dark') return <Moon className="w-5 h-5" />
    return <Sun className="w-5 h-5" />
  }

  return (
    <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-md border-b">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-accent rounded-lg transition-colors lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="hidden md:block">
            <h1 className="text-lg font-semibold">
              Welcome back, {user?.address ? `${user.address.slice(0, 6)}...${user.address.slice(-4)}` : 'User'}
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage your DAO treasury with AI-powered insights
            </p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-2">
          {/* Theme Toggle */}
          <button
            onClick={handleThemeToggle}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
            title={`Theme: ${theme}`}
          >
            {getThemeIcon()}
          </button>

          {/* Notifications */}
          <div ref={notificationRef} className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 hover:bg-accent rounded-lg transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full animate-pulse" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-card border rounded-lg shadow-lg">
                <div className="p-4 border-b">
                  <h3 className="font-semibold">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={cn(
                          'p-4 border-b hover:bg-accent/50 cursor-pointer transition-colors',
                          !notification.read && 'bg-accent/20'
                        )}
                        onClick={() => {
                          markAsRead(notification.id)
                          if (notification.action) {
                            navigate(notification.action.link)
                            setShowNotifications(false)
                          }
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{notification.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {format(notification.timestamp, 'MMM d, h:mm a')}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary-500 rounded-full ml-2 mt-2" />
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile Menu */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <User className="w-5 h-5" />
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-48 bg-card border rounded-lg shadow-lg">
                <div className="p-2">
                  <button
                    onClick={() => {
                      navigate('/app/privacy')
                      setShowProfile(false)
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 hover:bg-accent rounded-lg transition-colors text-left"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="text-sm">Settings</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-3 py-2 hover:bg-accent rounded-lg transition-colors text-left text-destructive"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
