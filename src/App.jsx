import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LangProvider } from './i18n'
import Landing from './pages/Landing'
import Admin from './pages/Admin'
import Objects from './pages/Objects'
import ContactPage from './pages/ContactPage'
import ObjectDetail from './pages/ObjectDetail'
import { BidProvider } from './lib/BidContext'
import BidDrawer from './components/BidDrawer'

export default function App() {
  return (
    <BrowserRouter>
      <LangProvider>
        <BidProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/objekt" element={<Objects />} />
            <Route path="/objekt/:id" element={<ObjectDetail />} />
            <Route path="/kontakt" element={<ContactPage />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
          <BidDrawer />
        </BidProvider>
      </LangProvider>
    </BrowserRouter>
  )
}
