import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getTickets } from '../api/ticketService'
import TicketFilters from '../components/TicketFilters'
import TicketCard from '../components/TicketCard'

export default function TicketListPage() {
  const [tickets, setTickets] = useState([])
  const [filters, setFilters] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  //Función para actualizar filtros y activar el estado de carga a la vez
  const handleFilterChange = (newFilters) => {
    setLoading(true)
    setError(null)
    setFilters(newFilters)
  }

  useEffect(() => {
    let ignore = false

    getTickets(filters)
      .then((response) => {
        if (!ignore) setTickets(response.data)
      })
      .catch(() => {
        if (!ignore) setError('No se pudieron cargar los tickets')
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    // Limpieza para evitar actualizar estado si el usuario cambia filtros rápido
    return () => {
      ignore = true
    }
  }, [filters])

  return (
    <div>
      <h1>Tickets</h1>
      <Link to="/tickets/nuevo">+ Nuevo ticket</Link>

      {/* Pasar la nueva función controladora */}
      <TicketFilters filters={filters} onChange={handleFilterChange} />

      {loading && <p>Cargando...</p>}
      {error && <p>{error}</p>}

      <ul>
        {tickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}
      </ul>
    </div>
  )
}