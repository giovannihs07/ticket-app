import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getTickets } from '../api/ticketService'
import { useAuth } from '../context/AuthContext'
import TicketFilters from '../components/TicketFilters'
import TicketCard from '../components/TicketCard'
import Alert from '../components/ui/Alert'
import LoadingSpinner from '../components/ui/LoadingSpinner'

export default function TicketListPage() {
  const { isAuthenticated, isAgente } = useAuth()
  const [tickets, setTickets] = useState([])
  const [filters, setFilters] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

    return () => {
      ignore = true
    }
  }, [filters])

  return (
    <div className="page">
      <div className="page__header">
        <div className="page__header-text">
          <h1>{isAgente ? 'Todos los tickets' : 'Mis tickets'}</h1>
          <p>
            {isAgente
              ? 'Gestiona y da seguimiento a todas las solicitudes del sistema.'
              : 'Consulta el estado de tus solicitudes y crea nuevos tickets.'}
          </p>
        </div>
        {(!isAuthenticated || !isAgente) && (
          <div className="page__actions">
            <Link to="/tickets/nuevo" className="btn btn--primary">
              + Nuevo ticket
            </Link>
          </div>
        )}
      </div>

      <TicketFilters filters={filters} onChange={handleFilterChange} />

      {loading && <LoadingSpinner message="Cargando tickets..." />}
      {error && <Alert variant="error">{error}</Alert>}

      {!loading && !error && tickets.length === 0 && (
        <div className="empty-state">
          <div className="empty-state__icon" aria-hidden="true">📭</div>
          <p className="empty-state__title">No hay tickets</p>
          <p>
            {(!isAuthenticated || !isAgente)
              ? 'Crea tu primer ticket para comenzar.'
              : 'No se encontraron tickets con los filtros seleccionados.'}
          </p>
          {(!isAuthenticated || !isAgente) && (
            <Link to="/tickets/nuevo" className="btn btn--primary" style={{ marginTop: '1rem' }}>
              Crear ticket
            </Link>
          )}
        </div>
      )}

      {!loading && tickets.length > 0 && (
        <div className="ticket-list">
          {tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )}
    </div>
  )
}
