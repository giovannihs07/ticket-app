// src/components/TicketFilters.jsx
export default function TicketFilters({ filters, onChange }) {
  const handleChange = (e) => {
    const { name, value } = e.target
    onChange({ ...filters, [name]: value || undefined })
  }

  return (
    <div>
      <select name="estado" value={filters.estado || ''} onChange={handleChange}>
        <option value="">Todos los estados</option>
        <option value="ABIERTO">Abierto</option>
        <option value="EN_PROGRESO">En progreso</option>
        <option value="CERRADO">Cerrado</option>
      </select>

      <select name="prioridad" value={filters.prioridad || ''} onChange={handleChange}>
        <option value="">Todas las prioridades</option>
        <option value="BAJA">Baja</option>
        <option value="MEDIA">Media</option>
        <option value="ALTA">Alta</option>
      </select>
    </div>
  )
}