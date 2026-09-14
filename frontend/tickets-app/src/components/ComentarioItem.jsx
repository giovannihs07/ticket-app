
export default function ComentarioItem({ comentario }) {
  return (
    <article className="comment-item">
      <div className="comment-item__header">
        <strong className="comment-item__title">{comentario.titulo}</strong>
        <time className="comment-item__date" dateTime={comentario.fecha_registro}>
          {new Date(comentario.fecha_registro).toLocaleString()}
        </time>
      </div>
      <p className="comment-item__body">{comentario.descripcion}</p>
    </article>
  )
}
