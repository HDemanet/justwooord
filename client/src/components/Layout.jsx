import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { to: '/', label: 'Tableau de bord', shortLabel: 'Accueil', icon: <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="1" width="5" height="5" rx="1"/><rect x="8" y="1" width="5" height="5" rx="1"/><rect x="1" y="8" width="5" height="5" rx="1"/><rect x="8" y="8" width="5" height="5" rx="1"/></svg> },
  { to: '/reviser', label: 'Réviser', shortLabel: 'Réviser', icon: <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="2,1 12,7 2,13"/></svg> },
  { to: '/ajouter', label: 'Ajouter un mot', shortLabel: 'Ajouter', icon: <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="7" cy="7" r="6"/><path d="M7 4v6M4 7h6"/></svg> },
  { to: '/vocabulaire', label: 'Vocabulaire', shortLabel: 'Mots', icon: <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 3h12M1 7h9M1 11h10"/></svg> },
  { to: '/lecons', label: 'Leçons', shortLabel: 'Leçons', icon: <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="1" width="12" height="12" rx="1"/><path d="M1 6h12"/></svg> },
  { to: '/import', label: 'Import Excel', shortLabel: 'Import', icon: <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 1v8M4 6l3 3 3-3M2 10v3h10v-3"/></svg> },
]

const navy = '#1B2A4A'

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <>
      <a href="#main-content" style={{position:'absolute',left:'-9999px'}} onFocus={e=>e.target.style.left='1rem'} onBlur={e=>e.target.style.left='-9999px'}>Aller au contenu principal</a>

      <div className="flex h-screen font-sans" style={{ background: '#F8F9FC' }}>

        {/* Sidebar desktop */}
        <aside className="hidden md:flex flex-col flex-shrink-0" style={{ width: '220px', background: navy }}>
          <div className="px-5 py-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <a href="/" style={{ textDecoration: 'none' }}>
              <div className="font-bold tracking-tight leading-none" style={{ color: '#EEF0F5', fontSize: '20px' }}>
                JustWoord
              </div>
              <div className="mt-1.5" style={{ color: 'rgba(238,240,245,0.4)', fontSize: '9px', letterSpacing: '1.2px', textTransform: 'uppercase' }}>
                Apprendre le néerlandais
              </div>
            </a>
          </div>

          <nav className="flex-1 px-3 py-3" aria-label="Navigation principale">
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
              <div className="rounded-full flex items-center justify-center flex-shrink-0" style={{ width: '28px', height: '28px', background: 'rgba(74,127,203,0.25)' }} aria-hidden="true">
                <span style={{ color: '#7AAEE8', fontSize: '11px', fontWeight: '600' }}>
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <span style={{ color: 'rgba(238,240,245,0.7)', fontSize: '12px' }}>{user?.name}</span>
            </div>
            <button
              onClick={handleLogout}
              aria-label="Se déconnecter"
              style={{ color: 'rgba(238,240,245,0.45)', fontSize: '11px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              className="hover:opacity-75 transition-opacity"
            >
              Déconnexion
            </button>
          </div>
        </aside>

        {/* Contenu principal */}
        <div className="flex flex-col flex-1 min-w-0">

          {/* Header mobile */}
          <header
            className="flex md:hidden items-center justify-between px-4 py-3 flex-shrink-0"
            style={{ background: navy, borderBottom: '1px solid rgba(255,255,255,0.07)' }}
          >
            <a href="/" style={{ textDecoration: 'none' }}>
              <div className="font-bold" style={{ color: '#EEF0F5', fontSize: '18px' }}>JustWoord</div>
            </a>
            <div className="flex items-center gap-2">
              <div className="rounded-full flex items-center justify-center" style={{ width: '28px', height: '28px', background: 'rgba(74,127,203,0.25)' }} aria-hidden="true">
                <span style={{ color: '#7AAEE8', fontSize: '11px', fontWeight: '600' }}>
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <button
                onClick={handleLogout}
                aria-label="Se déconnecter"
                style={{ color: 'rgba(238,240,245,0.5)', fontSize: '11px', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Quitter
              </button>
            </div>
          </header>

          {/* Contenu de la page */}
          <main id="main-content" className="flex-1 overflow-y-auto p-4 md:p-6" style={{ paddingBottom: '80px' }}>
            {children}
          </main>
        </div>
      </div>

      {/* Barre de navigation mobile */}
      <nav
        className="fixed bottom-0 left-0 right-0 flex md:hidden"
        style={{ background: navy, borderTop: '1px solid rgba(255,255,255,0.1)', zIndex: 50 }}
        aria-label="Navigation mobile"
      >
        {navItems.map(({ to, shortLabel, icon }) => {
          const isActive = to === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(to)
          return (
            <NavLink
              key={to}
              to={to}
              className="flex flex-col items-center justify-center flex-1 py-2.5 gap-1 transition-opacity"
              style={{
                color: isActive ? '#7AAEE8' : 'rgba(238,240,245,0.45)',
                textDecoration: 'none',
              }}
              aria-current={isActive ? 'page' : undefined}
            >
              <span style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {icon}
              </span>
              <span style={{ fontSize: '9px', letterSpacing: '0.3px' }}>{shortLabel}</span>
            </NavLink>
          )
        })}
      </nav>
    </>
  )
}
