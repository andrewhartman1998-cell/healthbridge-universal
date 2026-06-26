import { HashRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Send from './pages/Send'
import Inbox from './pages/Inbox'
import HowItWorks from './pages/HowItWorks'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/send" element={<Send />} />
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
      </Routes>
    </HashRouter>
  )
}
