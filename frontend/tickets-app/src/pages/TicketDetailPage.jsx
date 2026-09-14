
import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getTicket, updateTicket, getComentarios, createComentario } from '../api/ticketService'
import TicketInfo from '../components/TicketInfo'
import TicketActions from '../components/TicketActions'
import ComentarioList from '../components/ComentarioList'
import ComentarioForm from '../components/ComentarioForm'
import Alert from '../components/ui/Alert'
import LoadingSpinner from '../components/ui/LoadingSpinner'

export default function TicketDetailPage() {
  const { id } = useParams()
  const [ticket, setTicket] = useState(null)
  const [comentarios, setComentarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadTicket = () => {
    setLoading(true)
    getTicket(id)
      .then((res) => setTicket(res.data))
      .catch(() => setError('No se pudo cargar el ticket'))
      .finally(() => setLoading(false))
  }

  const loadComentarios = () => {
    getComentarios(id).then((res) => setComentarios(res.data))
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadTicket()
    loadComentarios()
  }, [id])

  const handleUpdate = async (changes) => {
    const res = await updateTicket(id, changes)
    setTicket(res.data)
  }

  const handleNewComentario = async (data) => {
    await createComentario(id, data)
    loadComentarios()
  }

  if (loading) {
    return (
      <div className="page">
        <LoadingSpinner message="Cargando ticket..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="page">
        <Alert variant="error">{error}</Alert>
        <Link to="/" className="btn btn--secondary">Volver al listado</Link>
      </div>
    )
  }

  if (!ticket) return null

  return (
    <div className="page ticket-detail">
      <Link to="/" className="back-link">← Volver al listado</Link>

      <div className="ticket-detail__grid">
        <div className="ticket-detail__main">
          <TicketInfo ticket={ticket} />

          <div className="card comments">
            <div className="card__header">
              <h2 className="card__title">Comentarios ({comentarios.length})</h2>
            </div>
            <ComentarioList comentarios={comentarios} />
            <ComentarioForm onSubmit={handleNewComentario} />
          </div>
        </div>

        <aside>
          <TicketActions ticket={ticket} onUpdate={handleUpdate} />
        </aside>
      </div>
    </div>
  )
}
