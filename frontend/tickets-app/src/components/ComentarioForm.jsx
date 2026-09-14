
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
    setForm(initialState) // limpia el formulario tras enviar
    setSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="titulo"
        placeholder="Título del comentario"
        value={form.titulo}
        onChange={handleChange}
        required
      />
      <textarea
        name="descripcion"
        placeholder="Escribe un comentario..."
        value={form.descripcion}
        onChange={handleChange}
        required
      />
      <button type="submit" disabled={submitting}>
        {submitting ? 'Enviando...' : 'Agregar comentario'}
      </button>
    </form>
  )
}