import { Link, Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="auth-layout">
      <div className="auth-layout__panel auth-layout__panel--brand">
        <div className="auth-layout__brand-content">
          <Link to="/" className="auth-layout__logo">
            <span aria-hidden="true" align="center"></span>
            TicketsApp
          </Link>
          <h1 className="auth-layout__headline">
            Gestiona tickets internos de forma simple
          </h1>
          <p className="auth-layout__description">
            Solicitantes crean y siguen sus tickets. <br /> 
            Agentes los gestionan, actualizan estado y prioridad, y responden con comentarios.
          </p>
          <ul className="auth-layout__features">
            <li>Crear y listar tickets con filtros</li>
            <li>Seguimiento de estado y prioridad</li>
            <li>Comentarios en cada ticket</li>
            <li>Roles: Agente y Solicitante</li>
          </ul>
        </div>
      </div>

      <div className="auth-layout__panel auth-layout__panel--form">
        <div className="auth-layout__form-wrapper">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
