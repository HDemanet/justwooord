import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { to: '/', label: 'Tableau de bord', icon: <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="1" width="5" height="5" rx="1"/><rect x="8" y="1" width="5" height="5" rx="1"/><rect x="1" y="8" width="5" height="5" rx="1"/><rect x="8" y="8" width="5" height="5" rx="1"/></svg> },
  { to: '/reviser', label: 'Réviser', icon: <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="2,1 12,7 2,13"/></svg> },
  { to: '/ajouter', label: 'Ajouter un mot', icon: <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="7" cy="7" r="6"/><path d="M7 4v6M4 7h6"/></svg> },
  { to: '/vocabulaire', label: 'Vocabulaire', icon: <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 3h12M1 7h9M1 11h10"/></svg> },
  { to: '/lecons', label: 'Leçons', icon: <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="1" width="12" height="12" rx="1"/><path d="M1 6h12"/></svg> },
  { to: '/import', label: 'Import Excel', icon: <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 1v8M4 6l3 3 3-3M2 10v3h10v-3"/></svg> },
]

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen font-sans" style={{ background: '#F8F9FC' }}>
      <aside className="flex flex-col flex-shrink-0" style={{ width: '210px', background: '#1B2A4A' }}>

        <div className="px-5 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="font-semibold tracking-tight leading-none" style={{ color: '#EEF0F5', fontSize: '16px' }}>
            JustWoord
          </div>
          <div className="mt-1" style={{ color: 'rgba(238,240,245,0.4)', fontSize: '9px', letterSpacing: '1px', textTransform: 'uppercase' }}>
            Apprendre le néerlandais
          </div>
        </div>

        <nav className="flex-1 px-3 py-3">
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs mb-0.5 transition-all"
              style={({ isActive }) => ({
                background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: isActive ? '#EEF0F5' : 'rgba(238,240,245,0.6)',
                fontWeight: isActive ? '500' : '400',
              })}
            >
              <span style={{ width: '14px', height: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {icon}
              </span>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-5 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-2 mb-2">
            <div className="rounded-full flex items-center justify-center flex-shrink-0" style={{ width: '26px', height: '26px', background: 'rgba(74,127,203,0.25)' }}>
              <span style={{ color: '#7AAEE8', fontSize: '11px', fontWeight: '500' }}>
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <span style={{ color: 'rgba(238,240,245,0.7)', fontSize: '12px' }}>{user?.name}</span>
          </div>
          <button
            onClick={handleLogout}
            style={{ color: 'rgba(238,240,245,0.45)', fontSize: '11px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            className="hover:opacity-75 transition-opacity"
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
