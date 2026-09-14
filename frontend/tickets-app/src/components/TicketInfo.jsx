import Badge from './ui/Badge'
import {
  ESTADO_LABELS,
  PRIORIDAD_LABELS,
  ESTADO_BADGE,
  PRIORIDAD_BADGE,
} from '../utils/constants'

export default function TicketInfo({ ticket }) {
  const estadoVariant = ESTADO_BADGE[ticket.estado]?.replace('badge--', '') || 'default'
  const prioridadVariant = PRIORIDAD_BADGE[ticket.prioridad]?.replace('badge--', '') || 'default'

  return (
    <div className="card ticket-info">
      <div className="ticket-info__header">
        <h1>{ticket.titulo}</h1>
        <div className="ticket-info__badges">
          <Badge variant={estadoVariant}>{ESTADO_LABELS[ticket.estado]}</Badge>
          <Badge variant={prioridadVariant}>{PRIORIDAD_LABELS[ticket.prioridad]}</Badge>
        </div>
      </div>

      <p className="ticket-info__description">{ticket.descripcion}</p>

      <div className="ticket-info__meta">
        <div className="ticket-info__meta-item">
          <span className="ticket-info__meta-label">Categoría</span>
          <span className="ticket-info__meta-value">{ticket.categoria}</span>
        </div>
        <div className="ticket-info__meta-item">
          <span className="ticket-info__meta-label">Creado</span>
          <span className="ticket-info__meta-value">
            {new Date(ticket.created_at).toLocaleString()}
          </span>
        </div>
        <div className="ticket-info__meta-item">
          <span className="ticket-info__meta-label">Actualizado</span>
          <span className="ticket-info__meta-value">
            {new Date(ticket.updated_at).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  )
}
