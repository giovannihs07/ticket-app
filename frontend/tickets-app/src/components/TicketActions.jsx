// src/components/TicketActions.jsx — sí tiene estado propio (los selects), pero no llama a la API directamente
import { useState } from 'react'

export default function TicketActions({ ticket, onUpdate }) {
  const [estado, setEstado] = useState(ticket.estado)
  const [prioridad, setPrioridad] = useState(ticket.prioridad)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await onUpdate({ estado, prioridad })
    setSaving(false)
  }

  return (
    <div>
      <select value={estado} onChange={(e) => setEstado(e.target.value)}>
        <option value="ABIERTO">Abierto</option>
        <option value="EN_PROGRESO">En progreso</option>
        <option value="CERRADO">Cerrado</option>
      </select>

      <select value={prioridad} onChange={(e) => setPrioridad(e.target.value)}>
        <option value="BAJA">Baja</option>
        <option value="MEDIA">Media</option>
        <option value="ALTA">Alta</option>
      </select>

      <button onClick={handleSave} disabled={saving}>
        {saving ? 'Guardando...' : 'Guardar cambios'}
      </button>
    </div>
  )
}