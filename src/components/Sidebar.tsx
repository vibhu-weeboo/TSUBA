import { Link, useLocation } from 'react-router-dom'
import { Home, CheckSquare, Search, Calendar, Puzzle, Settings, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { clsx } from 'clsx'

const Sidebar = () => {
  const location = useLocation()
  const { logout } = useAuth()

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/tasks', icon: CheckSquare, label: 'Tasks' },
    { path: '/research', icon: Search, label: 'Research' },
    { path: '/scheduler', icon: Calendar, label: 'Scheduler' },
    { path: '/plugins', icon: Puzzle, label: 'Plugins' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-primary-600">TSUBA</h1>
        <p className="text-sm text-gray-600 mt-1">AI-Powered Assistant</p>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={clsx(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                    isActive(item.path)
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
