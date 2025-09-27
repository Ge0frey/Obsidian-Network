import { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Background Pattern */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-accent-500/5" />
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="h-full w-full" style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 8px, rgb(156, 146, 172) 8px, rgb(156, 146, 172) 9px)`,
            backgroundSize: '32px 32px'
          }} />
        </div>
      </div>

      {/* Header */}
      <header className="p-6">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">O</span>
            </div>
            <span className="font-bold text-2xl">Obsidian Network</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-sm text-muted-foreground">
        <p>Privacy-First AI Financial Intelligence for DAOs</p>
        <p className="mt-2">Powered by Midnight Network</p>
      </footer>
    </div>
  )
}
