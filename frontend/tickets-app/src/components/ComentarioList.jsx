import ComentarioItem from './ComentarioItem'

export default function ComentarioList({ comentarios }) {
  if (comentarios.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state__icon" aria-hidden="true">💬</div>
        <p className="empty-state__title">Sin comentarios aún</p>
        <p>Sé el primero en agregar un comentario a este ticket.</p>
      </div>
    )
  }

  return (
    <div className="comments__list">
      {comentarios.map((c) => (
        <ComentarioItem key={c.id} comentario={c} />
      ))}
    </div>
  )
}
