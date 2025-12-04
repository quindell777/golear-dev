/**
 * @file PrivateRoute.tsx
 * @description
 * Componente de proteção de rotas privadas.
 * - Verifica se o usuário está logado
 * - Espera carregamento inicial da autenticação antes de renderizar
 * - Redireciona para /login se não houver usuário logado
 */

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

/* -------------------------------------------------------------------------- */
/*                              TIPAGEM DO COMPONENTE                          */
/* -------------------------------------------------------------------------- */

interface PrivateRouteProps {
  children: React.ReactElement; // Componente protegido que será renderizado
}

/* -------------------------------------------------------------------------- */
/*                              COMPONENTE                                   */
/* -------------------------------------------------------------------------- */

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user, loadingAuth } = useAuth();

  // 🔄 Enquanto o AuthContext carrega (token do localStorage/SessionStorage)
  if (loadingAuth) return <div>Carregando autenticação...</div>; // pode ser spinner ou skeleton

  // 🔒 Se não houver usuário, redireciona para login
  if (!user) return <Navigate to="/login" replace />;

  // ✅ Usuário logado, renderiza componente filho protegido
  return children;
};

export default PrivateRoute;
