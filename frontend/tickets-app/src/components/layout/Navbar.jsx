import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { ROLE_LABELS } from '../../utils/constants'

export default function Navbar() {
  const { user, isAuthenticated, isAgente, logout } = useAuth()

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand">
          <span className="navbar__logo" aria-hidden="true">🎫</span>
          <span>TicketsApp</span>
        </Link>

        <nav className="navbar__nav" aria-label="Principal">
          <NavLink to="/" className="navbar__link" end>
            {isAgente ? 'Todos los tickets' : 'Tickets'}
          </NavLink>
          {(!isAuthenticated || !isAgente) && (
            <NavLink to="/tickets/nuevo" className="navbar__link">
              Nuevo ticket
            </NavLink>
          )}
        </nav>

        <div className="navbar__actions">
          {isAuthenticated ? (
            <>
              <div className="navbar__user">
                <span className="navbar__username">{user.username}</span>
                <span className={`navbar__role navbar__role--${user.role?.toLowerCase()}`}>
                  {ROLE_LABELS[user.role]}
                </span>
              </div>
              <button type="button" className="btn btn--ghost btn--sm" onClick={logout}>
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn--ghost btn--sm">Iniciar sesión</Link>
              <Link to="/registro" className="btn btn--primary btn--sm">Registrarse</Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
