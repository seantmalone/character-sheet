import { Routes, Route } from 'react-router-dom'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<div>Roster placeholder</div>} />
      <Route path="/new" element={<div>Wizard placeholder</div>} />
      <Route path="/character/:id" element={<div>Sheet placeholder</div>} />
      <Route path="/character/:id/print" element={<div>Print placeholder</div>} />
    </Routes>
  )
}
