import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { to: '/', label: 'Tableau de bord', icon: '⊞' },
  { to: '/reviser', label: 'Réviser', icon: '◫' },
  { to: '/ajouter', label: 'Ajouter un mot', icon: '+' },
  { to: '/vocabulaire', label: 'Vocabulaire', icon: '≡' },
  { to: '/lecons', label: 'Leçons', icon: '▤' },
  { to: '/import', label: 'Import Excel', icon: '↑' },
]

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <aside className="w-52 bg-white border-r border-gray-100 flex flex-col py-5 flex-shrink-0">
        <div className="px-4 pb-6 border-b border-gray-100">
          <div className="text-teal-700 font-medium text-lg tracking-tight">JustWoord</div>
          <div className="text-gray-400 text-xs uppercase tracking-widest mt-1">néerlandais judiciaire</div>
        </div>

        <nav className="mt-2 flex-1">
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-teal-50 text-teal-700 font-medium border-r-2 border-teal-500'
                    : 'text-gray-500 hover:bg-gray-50'
                }`
              }
            >
              <span className="text-base">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 pt-4 border-t border-gray-100">
          <div className="text-xs text-gray-500 mb-1">{user?.name}</div>
          <button
            onClick={handleLogout}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-6">
        {children}
      </main>
    </div>
  )
}
