import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Badge from './ui/Badge'
import {
  ESTADO_LABELS,
  PRIORIDAD_LABELS,
  ESTADO_BADGE,
  PRIORIDAD_BADGE,
} from '../utils/constants'

export default function TicketActions({ ticket, onUpdate }) {
  const { isAuthenticated, isAgente } = useAuth()
  const canManage = !isAuthenticated || isAgente
  const [estado, setEstado] = useState(ticket.estado)
  const [prioridad, setPrioridad] = useState(ticket.prioridad)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await onUpdate({ estado, prioridad })
    setSaving(false)
  }

  const estadoVariant = ESTADO_BADGE[ticket.estado]?.replace('badge--', '') || 'default'
  const prioridadVariant = PRIORIDAD_BADGE[ticket.prioridad]?.replace('badge--', '') || 'default'

  return (
    <div className="card ticket-actions">
      <div className="card__header">
        <h2 className="card__title">Gestión del ticket</h2>
      </div>

      {canManage ? (
        <>
          <div className="ticket-actions__fields">
            <div className="form__group">
              <label htmlFor="estado">Estado</label>
              <select id="estado" value={estado} onChange={(e) => setEstado(e.target.value)}>
                <option value="ABIERTO">Abierto</option>
                <option value="EN_PROGRESO">En progreso</option>
                <option value="CERRADO">Cerrado</option>
              </select>
            </div>

            <div className="form__group">
              <label htmlFor="prioridad">Prioridad</label>
              <select id="prioridad" value={prioridad} onChange={(e) => setPrioridad(e.target.value)}>
                <option value="BAJA">Baja</option>
                <option value="MEDIA">Media</option>
                <option value="ALTA">Alta</option>
              </select>
            </div>
          </div>

          <button type="button" className="btn btn--primary btn--full" onClick={handleSave} disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </>
      ) : (
        <div className="ticket-actions__readonly">
          <div className="form__group">
            <span className="ticket-info__meta-label">Estado actual</span>
            <div><Badge variant={estadoVariant}>{ESTADO_LABELS[ticket.estado]}</Badge></div>
          </div>
          <div className="form__group">
            <span className="ticket-info__meta-label">Prioridad actual</span>
            <div><Badge variant={prioridadVariant}>{PRIORIDAD_LABELS[ticket.prioridad]}</Badge></div>
          </div>
          <p className="ticket-actions__note">
            Solo los agentes pueden modificar el estado y la prioridad del ticket.
          </p>
        </div>
      )}
    </div>
  )
}
