import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createTicket } from '../api/ticketService'
import Alert from '../components/ui/Alert'

const initialState = {
  titulo: '',
  descripcion: '',
  categoria: '',
  prioridad: 'MEDIA',
}

export default function TicketFormPage() {
  const [form, setForm] = useState(initialState)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const response = await createTicket(form)
      navigate(`/tickets/${response.data.id}`)
    } catch (err) {
      setError('No se pudo crear el ticket. Revisa los campos e intenta de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page">
      <Link to="/" className="back-link">← Volver al listado</Link>

      <div className="page__header">
        <div className="page__header-text">
          <h1>Nuevo ticket</h1>
          <p>Describe tu solicitud para que el equipo de soporte pueda atenderla.</p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: '640px' }}>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form__group">
            <label htmlFor="titulo">Título</label>
            <input
              id="titulo"
              name="titulo"
              value={form.titulo}
              onChange={handleChange}
              placeholder="Resumen breve del problema"
              required
            />
          </div>

          <div className="form__group">
            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              placeholder="Detalla tu solicitud con la mayor información posible..."
              required
            />
          </div>

          <div className="form__row">
            <div className="form__group">
              <label htmlFor="categoria">Categoría</label>
              <input
                id="categoria"
                name="categoria"
                value={form.categoria}
                onChange={handleChange}
                placeholder="Ej. Hardware, Software, Red"
                required
              />
            </div>

            <div className="form__group">
              <label htmlFor="prioridad">Prioridad</label>
              <select id="prioridad" name="prioridad" value={form.prioridad} onChange={handleChange}>
                <option value="BAJA">Baja</option>
                <option value="MEDIA">Media</option>
                <option value="ALTA">Alta</option>
              </select>
            </div>
          </div>

          {error && <Alert variant="error">{error}</Alert>}

          <div className="page__actions">
            <button type="submit" className="btn btn--primary" disabled={submitting}>
              {submitting ? 'Creando...' : 'Crear ticket'}
            </button>
            <Link to="/" className="btn btn--secondary">Cancelar</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
