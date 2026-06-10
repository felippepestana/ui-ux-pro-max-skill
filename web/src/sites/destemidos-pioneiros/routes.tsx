import { Routes, Route, Navigate } from 'react-router-dom'
import DestemidosPioneirosSite from './DestemidosPioneirosSite'
import { AuthProvider } from './platform/auth/AuthProvider'
import { RequireHakuna } from './platform/auth/RequireHakuna'
import InscricaoPage from './platform/public/InscricaoPage'
import ExamesUploadPage from './platform/public/ExamesUploadPage'
import MensagensPage from './platform/public/MensagensPage'
import StatusPage from './platform/public/StatusPage'
import LoginPage from './platform/painel/LoginPage'
import DashboardPage from './platform/painel/DashboardPage'
import SenderistasPage from './platform/painel/SenderistasPage'
import ExamesPage from './platform/painel/ExamesPage'
import ProntuarioPage from './platform/painel/ProntuarioPage'
import TrilhaPage from './platform/painel/TrilhaPage'
import MensagensPainelPage from './platform/painel/MensagensPainelPage'

// Mounted by main.tsx under <Route path="/destemidos-pioneiros/*">, so these
// paths are RELATIVE to /destemidos-pioneiros.
export function DestemidosPioneirosRoutes() {
  return (
    <AuthProvider>
      <Routes>
        <Route index element={<DestemidosPioneirosSite />} />

        {/* Público (token / INSERT público) */}
        <Route path="inscricao" element={<InscricaoPage />} />
        <Route path="exames/:upload_token" element={<ExamesUploadPage />} />
        <Route path="mensagens/:mensagens_token" element={<MensagensPage />} />
        <Route path="status/:upload_token" element={<StatusPage />} />

        {/* Painel do staff */}
        <Route path="painel/login" element={<LoginPage />} />
        <Route path="painel" element={<RequireHakuna><DashboardPage /></RequireHakuna>} />
        <Route path="painel/senderistas" element={<RequireHakuna><SenderistasPage /></RequireHakuna>} />
        <Route path="painel/exames" element={<RequireHakuna><ExamesPage /></RequireHakuna>} />
        <Route path="painel/prontuarios/:senderista_id" element={<RequireHakuna><ProntuarioPage /></RequireHakuna>} />
        <Route path="painel/trilha" element={<RequireHakuna><TrilhaPage /></RequireHakuna>} />
        <Route path="painel/mensagens" element={<RequireHakuna><MensagensPainelPage /></RequireHakuna>} />

        <Route path="*" element={<Navigate to="/destemidos-pioneiros" replace />} />
      </Routes>
    </AuthProvider>
  )
}
