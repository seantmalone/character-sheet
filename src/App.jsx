import { Routes, Route } from 'react-router-dom'
import Roster from './pages/Roster/Roster'
import Wizard from './pages/Wizard/Wizard'
import Sheet from './pages/Sheet/Sheet'
import PrintView from './pages/Print/PrintView'
import HomebrewPage from './pages/Homebrew/HomebrewPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Roster />} />
      <Route path="/new" element={<Wizard />} />
      <Route path="/character/:id" element={<Sheet />} />
      <Route path="/character/:id/print" element={<PrintView />} />
      <Route path="/homebrew" element={<HomebrewPage />} />
    </Routes>
  )
}
