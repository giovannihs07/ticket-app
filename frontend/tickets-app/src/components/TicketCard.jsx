import { useNavigate } from 'react-router-dom'
import Badge from './ui/Badge'
import {
  ESTADO_LABELS,
  PRIORIDAD_LABELS,
  ESTADO_BADGE,
  PRIORIDAD_BADGE,
} from '../utils/constants'

export default function TicketCard({ ticket }) {
  const navigate = useNavigate()
  const estadoVariant = ESTADO_BADGE[ticket.estado]?.replace('badge--', '') || 'default'
  const prioridadVariant = PRIORIDAD_BADGE[ticket.prioridad]?.replace('badge--', '') || 'default'
  const detailPath = `/tickets/${ticket.id}`

  const handleCardKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      navigate(detailPath)
    }
  }

  return (
    <article
      className="ticket-card"
      role="link"
      tabIndex="0"
      onClick={() => navigate(detailPath)}
      onKeyDown={handleCardKeyDown}
    >
      <div className="ticket-card__main">
        <span className="ticket-card__title">{ticket.titulo}</span>
        <div className="ticket-card__meta" onClick={(event) => event.stopPropagation()}>
          <span>{ticket.categoria}</span>
          <span>·</span>
          <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
        </div>
      </div>
      <div className="ticket-card__badges" onClick={(event) => event.stopPropagation()}>
        <Badge variant={estadoVariant}>{ESTADO_LABELS[ticket.estado]}</Badge>
        <Badge variant={prioridadVariant}>{PRIORIDAD_LABELS[ticket.prioridad]}</Badge>
      </div>
    </article>
  )
}
