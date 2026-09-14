import { Routes, Route } from 'react-router-dom'
import TicketListPage from './pages/TicketListPage'
import TicketFormPage from './pages/TicketFormPage'
import TicketDetailPage from './pages/TicketDetailPage'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<TicketListPage />} />
        <Route path="/tickets/nuevo" element={<TicketFormPage />} />
        <Route path="/tickets/:id" element={<TicketDetailPage />} />
      </Routes>
    </>
  )
}

export default App
