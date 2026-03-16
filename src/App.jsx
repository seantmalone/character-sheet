import { Routes, Route } from 'react-router-dom'
import Roster from './pages/Roster/Roster'
import Wizard from './pages/Wizard/Wizard'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Roster />} />
      <Route path="/new" element={<Wizard />} />
      <Route path="/character/:id" element={<div>Sheet placeholder</div>} />
      <Route path="/character/:id/print" element={<div>Print placeholder</div>} />
    </Routes>
  )
}
