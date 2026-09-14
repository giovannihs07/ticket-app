// src/pages/TicketFormPage.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createTicket } from '../api/ticketService'

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
      navigate(`/tickets/${response.data.id}`) // redirige al detalle del ticket recién creado
    } catch (err) {
      setError('No se pudo crear el ticket. Revisa los campos: ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h1>Nuevo ticket</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Título</label>
          <input
            name="titulo"
            value={form.titulo}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Descripción</label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Categoría</label>
          <input
            name="categoria"
            value={form.categoria}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Prioridad</label>
          <select name="prioridad" value={form.prioridad} onChange={handleChange}>
            <option value="BAJA">Baja</option>
            <option value="MEDIA">Media</option>
            <option value="ALTA">Alta</option>
          </select>
        </div>

        {error && <p>{error}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? 'Creando...' : 'Crear ticket'}
        </button>
      </form>
    </div>
  )
}