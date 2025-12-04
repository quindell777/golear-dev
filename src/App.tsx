import { Routes, Route } from "react-router-dom";
import { useState } from "react";

// Páginas públicas
import { LandingPage } from "./pages/Landing-Page";
import Register from "./pages/Register";
import Login from "./pages/Login";
import RecuperarSenha from "./pages/RecuperarSenha";
import NotFound from "./pages/NotFound";

// Páginas privadas
import Home from "./pages/Home";
import ProfileWrapper from "./pages/ProfileWrapper";
import AnalysisPage from "./pages/AnalysisPage";
import GolearPremium from "./pages/Planos";
import Settings from "./pages/Settings";
import SearchPage from "./pages/SearchPage"; // 👈 NOVA IMPORTAÇÃO AQUI

// Peneiras e Competições
//import PeneirasPage from "./pages/peneiras";
//import CompeticoesPage from "./pages/Competicoes";
import PeneirasPageTeste from "./pages/PeneirasTeste";
import CompeticoesPageTeste from "./pages/CompeticoesTeste";

// Contextos
import { AuthProvider } from "./context/AuthContext";
import { NewsProvider } from "./context/NewsContext";
import PrivateRoute from "./context/PrivateRoute";
import { BackendProvider } from "./context/BackendContext"; 


/**
 * App
 *
 * @description
 * Componente raiz da aplicação. Responsável por:
 *  - Inicializar contextos (Auth, News, Backend)
 *  - Definir rotas públicas e privadas
 *  - Gerenciar exibição do componente de configurações
 *
 * @returns {JSX.Element} Estrutura principal da aplicação
 */
function App() {
  // Estado para controlar se a tela de configurações está aberta
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <BackendProvider>
      <AuthProvider>
        <NewsProvider>
          <Routes>
            {/* 🔓 Rotas públicas */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/recuperar-senha" element={<RecuperarSenha />} />
            <Route path="*" element={<NotFound />} />

            {/* 🔒 Rotas privadas */}
            <Route
              path="/feed"
              element={
                <PrivateRoute>
                  <Home openSettings={() => setIsSettingsOpen(true)} />
                </PrivateRoute>
              }
            />
            
            {/* 🔍 ROTA DE BUSCA ADICIONADA AQUI */}
            <Route
              path="/search"
              element={
                <PrivateRoute>
                  <SearchPage />
                </PrivateRoute>
              }
            />

            <Route
              path="/profile/:id"
              element={
                <PrivateRoute>
                  <ProfileWrapper />
                </PrivateRoute>
              }
            />

            <Route
              path="/peneiras"
              element={
                <PrivateRoute>
                  <PeneirasPageTeste />
                </PrivateRoute>
              }
            />

            <Route
              path="/competicoes"
              element={
                <PrivateRoute>
                  <CompeticoesPageTeste />
                </PrivateRoute>
              }
            />

            <Route
              path="/analysis"
              element={
                <PrivateRoute>
                  <AnalysisPage />
                </PrivateRoute>
              }
            />

            <Route
              path="/planos"
              element={
                <PrivateRoute>
                  <GolearPremium />
                </PrivateRoute>
              }
            />
          </Routes>

          {/* ⚙️ Componente flutuante de configurações */}
          {isSettingsOpen && (
            <Settings onClose={() => setIsSettingsOpen(false)} />
          )}
        </NewsProvider>
      </AuthProvider>
    </BackendProvider>
  );
}

export default App;