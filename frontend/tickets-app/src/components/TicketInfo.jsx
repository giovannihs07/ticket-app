
export default function TicketInfo({ ticket }) {
  return (
    <div>
      <h1>{ticket.titulo}</h1>
      <p>{ticket.descripcion}</p>
      <p>Categoría: {ticket.categoria}</p>
      <p>Creado: {new Date(ticket.created_at).toLocaleString()}</p>
      <p>Actualizado: {new Date(ticket.updated_at).toLocaleString()}</p>
    </div>
  )
}