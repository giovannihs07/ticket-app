import { Link } from 'react-router-dom'

export default function TicketCard({ ticket }) {
  return (
    <li>
      <Link to={`/tickets/${ticket.id}`}>{ticket.titulo}</Link>
      <span> — {ticket.estado} — {ticket.prioridad}</span>
    </li>
  )
}