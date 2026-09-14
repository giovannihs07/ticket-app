export default function LoadingSpinner({ message = 'Cargando...' }) {
  return (
    <div className="loading">
      <div className="loading__spinner" aria-hidden="true" />
      <p className="loading__message">{message}</p>
    </div>
  )
}
