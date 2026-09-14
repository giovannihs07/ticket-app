import { Link } from 'react-router-dom'
import Badge from './ui/Badge'
import {
  ESTADO_LABELS,
  PRIORIDAD_LABELS,
  ESTADO_BADGE,
  PRIORIDAD_BADGE,
} from '../utils/constants'

export default function TicketCard({ ticket }) {
  const estadoVariant = ESTADO_BADGE[ticket.estado]?.replace('badge--', '') || 'default'
  const prioridadVariant = PRIORIDAD_BADGE[ticket.prioridad]?.replace('badge--', '') || 'default'

  return (
    <article className="ticket-card">
      <div className="ticket-card__main">
        <Link to={`/tickets/${ticket.id}`} className="ticket-card__title">
          {ticket.titulo}
        </Link>
        <div className="ticket-card__meta">
          <span>{ticket.categoria}</span>
          <span>·</span>
          <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
        </div>
      </div>
      <div className="ticket-card__badges">
        <Badge variant={estadoVariant}>{ESTADO_LABELS[ticket.estado]}</Badge>
        <Badge variant={prioridadVariant}>{PRIORIDAD_LABELS[ticket.prioridad]}</Badge>
      </div>
    </article>
  )
}
