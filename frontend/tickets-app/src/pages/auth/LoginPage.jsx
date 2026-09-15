import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Alert from '../../components/ui/Alert'


export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      await login({ ...form })
      navigate(from, { replace: true })
    } catch (err) {
      const message = err.response?.data?.detail
        || err.response?.data?.non_field_errors?.[0]
        || 'Credenciales inválidas. Verifica usuario y contraseña.'
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-card">
      <div className="auth-card__header">
        <h2>Iniciar sesión</h2>
        <p>Accede según tu rol en el sistema</p>
      </div>

      <form className="form" onSubmit={handleSubmit}>
        <div className="form__group">
          <label htmlFor="username">Usuario</label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Ingresa tu usuario"
            required
          />
        </div>

        <div className="form__group">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />
        </div>

        {error && <Alert variant="error">{error}</Alert>}

        <button type="submit" className="btn btn--primary btn--full" disabled={submitting}>
          {submitting ? 'Ingresando...' : `Iniciar sesión`}
        </button>
      </form>

      <p className="auth-card__footer">
        ¿No tienes cuenta?{' '}
        <Link to="/registro">Regístrate aquí</Link>
      </p>
    </div>
  )
}
