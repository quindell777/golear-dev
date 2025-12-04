import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { request, setAuthToken } from "../services/api";
import type { Profile, ProfileResponse } from "../types";

/* -------------------------------------------------------------------------- */
/*                              TIPAGENS LOCAIS                               */
/* -------------------------------------------------------------------------- */

interface DecodedToken {
  sub: string;
  name?: string;
  email: string;
  exp: number;
  role: "Jogador" | "Clube" | "Olheiro";
  [key: string]: any;
}

interface AuthContextType {
  user: DecodedToken | null;
  profile: Profile | null; // Perfil completo vindo da API
  token: string | null;
  loadingAuth: boolean; // Carregamento inicial do token
  loadingProfile: boolean; // Carregamento do perfil da API
  login: (token: string, remember: boolean) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>; // <-- FUNÇÃO EXPOSTA
}

/* -------------------------------------------------------------------------- */
/*                                CONTEXTO                                    */
/* -------------------------------------------------------------------------- */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* -------------------------------------------------------------------------- */
/*                                PROVIDER                                    */
/* -------------------------------------------------------------------------- */

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<DecodedToken | null>(null); // Dados do JWT
  const [profile, setProfile] = useState<Profile | null>(null); // Dados do /profile/api
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(true);

  /**
   * @function refreshProfile
   * @description Busca o perfil detalhado do usuário na API.
   */
  const refreshProfile = async () => { // <-- RENOMEADA
    setLoadingProfile(true);
    try {
      const res = await request<ProfileResponse>({ url: "/profile/api" });
      if (res.data.success) {
        const { user, profile: profileData } = res.data;
        const combinedProfile: Profile = {
          ...profileData,
          ...user,
          id: user.id,
        };
        setProfile(combinedProfile);
      }
    } catch (error) {
      console.error("Falha ao buscar perfil do usuário:", error);
      // Em caso de erro (ex: token inválido), deslogar para limpar o estado
      logout();
    } finally {
      setLoadingProfile(false);
    }
  };

  // Carregamento inicial do token
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken =
        localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

      if (storedToken) {
        try {
          const decoded: DecodedToken = jwtDecode(storedToken);
          if (decoded.exp * 1000 > Date.now()) {
            setToken(storedToken);
            setUser(decoded);
            setAuthToken(storedToken);
            await refreshProfile(); // <-- USA A FUNÇÃO RENOMEADA
          } else {
            logout(); // Token expirado
          }
        } catch (err) {
          console.error("Token inválido, limpando...", err);
          logout();
        }
      } else {
        setLoadingProfile(false); // Se não há token, não há perfil para carregar
      }
      setLoadingAuth(false);
    };

    initializeAuth();
  }, []);

  const login = async (newToken: string, remember: boolean) => {
    try {
      const decoded: DecodedToken = jwtDecode(newToken);
      setToken(newToken);
      setUser(decoded);
      setAuthToken(newToken);

      if (remember) localStorage.setItem("authToken", newToken);
      else sessionStorage.setItem("authToken", newToken);

      await refreshProfile(); // <-- USA A FUNÇÃO RENOMEADA
    } catch (err) {
      console.error("Erro ao decodificar token no login:", err);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setProfile(null); // Limpa o perfil
    setAuthToken(null);
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    setLoadingProfile(false); // Para o loading se estava em progresso
  };

  return (
    <AuthContext.Provider
      value={{ user, profile, token, loadingAuth, loadingProfile, login, logout, refreshProfile }} // <-- ADICIONADA AO VALOR
    >
      {children}
    </AuthContext.Provider>
  );
};

/* -------------------------------------------------------------------------- */
/*                                HOOK useAuth                                 */
/* -------------------------------------------------------------------------- */

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  return context;
};
