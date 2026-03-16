import { Routes, Route } from 'react-router-dom'
import Roster from './pages/Roster/Roster'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Roster />} />
      <Route path="/new" element={<div>Wizard placeholder</div>} />
      <Route path="/character/:id" element={<div>Sheet placeholder</div>} />
      <Route path="/character/:id/print" element={<div>Print placeholder</div>} />
    </Routes>
  )
}
