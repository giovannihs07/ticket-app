
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getTicket, updateTicket, getComentarios, createComentario } from '../api/ticketService'
import TicketInfo from '../components/TicketInfo'
import TicketActions from '../components/TicketActions'
import ComentarioList from '../components/ComentarioList'
import ComentarioForm from '../components/ComentarioForm'

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
    setTicket(res.data) // refresca solo el ticket, sin recargar toda la página
  }

  const handleNewComentario = async (data) => {
    await createComentario(id, data)
    loadComentarios() // vuelve a pedir comentarios actualizados
  }

  if (loading) return <p>Cargando...</p>
  if (error) return <p>{error}</p>
  if (!ticket) return null

  return (
    <div>
      <TicketInfo ticket={ticket} />
      <TicketActions ticket={ticket} onUpdate={handleUpdate} />
      <ComentarioList comentarios={comentarios} />
      <ComentarioForm onSubmit={handleNewComentario} />
    </div>
  )
}