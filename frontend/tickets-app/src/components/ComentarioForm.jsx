
import { useState } from 'react'

const initialState = { titulo: '', descripcion: '' }

export default function ComentarioForm({ onSubmit }) {
  const [form, setForm] = useState(initialState)
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    await onSubmit(form)
    setForm(initialState)
    setSubmitting(false)
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form__group">
        <label htmlFor="comentario-titulo">Título del comentario</label>
        <input
          id="comentario-titulo"
          name="titulo"
          placeholder="Ej. Actualización del caso"
          value={form.titulo}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form__group">
        <label htmlFor="comentario-descripcion">Comentario</label>
        <textarea
          id="comentario-descripcion"
          name="descripcion"
          placeholder="Escribe un comentario..."
          value={form.descripcion}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" className="btn btn--primary" disabled={submitting}>
        {submitting ? 'Enviando...' : 'Agregar comentario'}
      </button>
    </form>
  )
}
