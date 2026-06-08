import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import LockerRoom from './pages/LockerRoom'
import Vent from './pages/Vent'
import MentalHealth from './pages/MentalHealth'
import Challenges from './pages/Challenges'
import Stories from './pages/Stories'
import Resources from './pages/Resources'

export default function App() {
  return (
    <BrowserRouter basename="/healthbridge-universal/brotherhood">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/locker-room" element={<LockerRoom />} />
        <Route path="/vent" element={<Vent />} />
        <Route path="/mental-health" element={<MentalHealth />} />
        <Route path="/challenges" element={<Challenges />} />
        <Route path="/stories" element={<Stories />} />
        <Route path="/resources" element={<Resources />} />
      </Routes>
    </BrowserRouter>
  )
}
