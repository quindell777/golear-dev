// src/pages/Login/Login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Hook para navegar entre rotas
import styles from "./Login.module.scss";
import { loginUser } from "../../services/login"; // Função que chama o backend
import { useAuth } from "../../context/AuthContext"; // Hook para acessar contexto de autenticação

/**
 * @component Login
 * @description Página de login que autentica o usuário e redireciona para o feed usando ID do usuário na URL
 */
const Login: React.FC = () => {
  const navigate = useNavigate(); // Instância do navigate para redirecionar
  const { login } = useAuth(); // Pega a função de login do contexto

  // Estados dos inputs do formulário
  const [email, setEmail] = useState(""); // Email digitado
  const [password, setPassword] = useState(""); // Senha digitada
  const [remember, setRemember] = useState(false); // "Lembrar de mim"

  // Estados de interface
  const [loading, setLoading] = useState(false); // Controla loading do botão
  const [error, setError] = useState(""); // Mensagem de erro exibida no formulário

  /**
   * @function handleLoginSubmit
   * @description Lida com o envio do formulário de login
   * @param {React.FormEvent} e - Evento de submit do formulário
   */
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita refresh da página
    setError(""); // Limpa mensagens de erro anteriores
    setLoading(true); // Ativa loading enquanto espera a resposta do backend

    try {
      // Chama o serviço de login, enviando email e password
      const response = await loginUser({ email, password });

      if (response.token && response.user?.id) {
        // Salva token e dados do usuário no contexto
        login(response.token, remember);

        // Redireciona usuário logado para a página /feed
        navigate(`/feed`);
      } else {
        setError("Erro inesperado no servidor."); // Caso não venha token ou ID
      }
    } catch (err: any) {
      console.error("Erro ao fazer login:", err); // Log no console para dev
      setError("Email ou senha inválidos."); // Mensagem amigável para usuário
    } finally {
      setLoading(false); // Desativa loading, independente do resultado
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form className={styles.loginForm} onSubmit={handleLoginSubmit}>
        <h1 className={styles.title}>Bem-vindo de volta</h1>
        <p className={styles.subtitle}>Entre com sua conta para continuar</p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={`${styles.input} ${error && !email ? styles.inputError : ""}`}
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={`${styles.input} ${error ? styles.inputError : ""}`}
        />

        {error && <p className={styles.errorMessage}>{error}</p>}

        <div className={styles.rememberContainer}>
          <label>
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            Lembrar de mim
          </label>
        </div>

        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>

        <div className={styles.links}>
          <span onClick={() => navigate("/register")}>Criar conta</span>
          <span onClick={() => navigate("/recuperar-senha")}>Esqueceu a senha?</span>
        </div>
      </form>
    </div>
  );
};

export default Login;
