
export default function ComentarioItem({ comentario }) {
  return (
    <li>
      <strong>{comentario.titulo}</strong>
      <p>{comentario.descripcion}</p>
      <small>{new Date(comentario.fecha_registro).toLocaleString()}</small>
    </li>
  )
}