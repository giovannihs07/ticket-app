import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Alert from '../../components/ui/Alert'
import { ROLES, ROLE_LABELS } from '../../utils/constants'

const ROLE_OPTIONS = [
  {
    value: ROLES.SOLICITANTE,
    label: ROLE_LABELS.SOLICITANTE,
    description: 'Para empleados que necesitan reportar incidencias o solicitudes',
    icon: '📋',
    features: ['Crear tickets', 'Ver tus solicitudes', 'Agregar comentarios'],
  },
  {
    value: ROLES.AGENTE,
    label: ROLE_LABELS.AGENTE,
    description: 'Para el equipo de soporte que resuelve y gestiona tickets',
    icon: '🛠️',
    features: ['Ver todos los tickets', 'Cambiar estado y prioridad', 'Responder comentarios'],
  },
]

export default function RegisterPage() {
  const location = useLocation()
  const initialRole = location.state?.role || ROLES.SOLICITANTE

  const [role, setRole] = useState(initialRole)
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (form.password !== form.password_confirm) {
      setError('Las contraseñas no coinciden')
      return
    }

    setSubmitting(true)

    try {
      await register({ ...form, role })
      navigate('/', { replace: true })
    } catch (err) {
      const data = err.response?.data
      const message = data?.detail
        || data?.username?.[0]
        || data?.email?.[0]
        || data?.password?.[0]
        || 'No se pudo completar el registro. Intenta de nuevo.'
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-card auth-card--wide">
      <div className="auth-card__header">
        <h2>Crear cuenta</h2>
        <p>Elige tu rol y completa tus datos</p>
      </div>

      <div className="role-cards">
        {ROLE_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`role-card ${role === option.value ? 'role-card--active' : ''}`}
            onClick={() => setRole(option.value)}
          >
            <div className="role-card__header">
              <span className="role-card__icon" aria-hidden="true">{option.icon}</span>
              <span className="role-card__label">{option.label}</span>
            </div>
            <p className="role-card__desc">{option.description}</p>
            <ul className="role-card__features">
              {option.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </button>
        ))}
      </div>

      <form className="form" onSubmit={handleSubmit}>
        <div className="form__row">
          <div className="form__group">
            <label htmlFor="username">Usuario</label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              value={form.username}
              onChange={handleChange}
              placeholder="nombre_usuario"
              required
            />
          </div>

          <div className="form__group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              placeholder="correo@empresa.com"
              required
            />
          </div>
        </div>

        <div className="form__row">
          <div className="form__group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              placeholder="Mínimo 8 caracteres"
              minLength={8}
              required
            />
          </div>

          <div className="form__group">
            <label htmlFor="password_confirm">Confirmar contraseña</label>
            <input
              id="password_confirm"
              name="password_confirm"
              type="password"
              autoComplete="new-password"
              value={form.password_confirm}
              onChange={handleChange}
              placeholder="Repite la contraseña"
              minLength={8}
              required
            />
          </div>
        </div>

        {error && <Alert variant="error">{error}</Alert>}

        <button type="submit" className="btn btn--primary btn--full" disabled={submitting}>
          {submitting ? 'Creando cuenta...' : `Registrarse como ${ROLE_LABELS[role]}`}
        </button>
      </form>

      <p className="auth-card__footer">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" state={{ role }}>Inicia sesión</Link>
      </p>
    </div>
  )
}
