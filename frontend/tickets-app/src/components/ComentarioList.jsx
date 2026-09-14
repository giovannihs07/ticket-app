
import ComentarioItem from './ComentarioItem'

export default function ComentarioList({ comentarios }) {
  if (comentarios.length === 0) return <p>Sin comentarios aún</p>

  return (
    <ul>
      {comentarios.map((c) => (
        <ComentarioItem key={c.id} comentario={c} />
      ))}
    </ul>
  )
}