import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import FeaturesPage from './pages/FeaturesPage'
import HistoricalDataPage from './pages/HistoricalDataPage'
import PitchPredictionPage from './pages/PitchPredictionPage'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/historical-data" element={<HistoricalDataPage />} />
        <Route path="/prediction" element={<PitchPredictionPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
