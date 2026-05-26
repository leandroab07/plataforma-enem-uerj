import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import TopicPage from './pages/TopicPage'
import Pratica from './pages/Pratica'
import TopicosSelect from './pages/TopicosSelect'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                  element={<Login />} />
        <Route path="/dashboard"         element={<Dashboard />} />
        <Route path="/topico/:topicoId"  element={<TopicPage />} />
        <Route path="/pratica"           element={<TopicosSelect />} />
        <Route path="/pratica/:topicoId" element={<Pratica />} />
        <Route path="*"                  element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
