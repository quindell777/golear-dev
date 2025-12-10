// src/pages/RecuperarSenha/RecuperarSenha.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// Importa estilos via CSS Modules
import styles from "./RecuperarSenha.module.scss";
// Importa os services
import { enviarEmailRecuperacao, alterarSenha } from "../../services/recuperarSenha";

/**
 * @interface StepFormData
 * @description Estrutura dos dados do formulário usados nos dois passos.
 */
interface StepFormData {
  email: string;
  token: string;
  password: string; // O nome é 'password' no formulário, mas será mapeado para 'novaSenha' no service.
}

/**
 * @component RecuperacaoSenha
 * @description
 * Componente que implementa o fluxo de recuperação de senha em 2 passos.
 */
const RecuperacaoSenha: React.FC = () => {
  const navigate = useNavigate();

  // state para controlar o passo atual (1 ou 2)
  const [step, setStep] = useState<1 | 2>(1);

  // state que contém todos os campos do formulário
  const [formData, setFormData] = useState<StepFormData>({
    email: "",
    token: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /** Define mensagem de erro e limpa mensagem de sucesso. */
  const showError = (msg: string) => {
    setError(msg);
    setSuccess("");
  };

  /** Define mensagem de sucesso e limpa mensagem de erro. */
  const showSuccess = (msg: string) => {
    setSuccess(msg);
    setError("");
  };

  /** Atualiza dinamicamente `formData` quando inputs mudam. */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /** Função para voltar ao passo 1 */
  const handleBack = () => {
    setStep(1);
    setError("");
    setSuccess("");
  };

  /** Função principal que lida com o submit do formulário. */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // --- PASSO 1: enviar email para gerar token ---
      if (step === 1) {
        if (!formData.email || !formData.email.includes("@")) {
          showError("Digite um email válido.");
          setLoading(false);
          return;
        }

        const response = await enviarEmailRecuperacao({ email: formData.email });

        if (response && response.success) {
          // A mensagem do backend é importante para evitar enumeração de usuários
          showSuccess(response.message || "Email enviado! Verifique sua caixa de entrada.");
          // Aguarda e avança para o passo 2
          setTimeout(() => {
            setStep(2);
            setSuccess(""); // Limpa sucesso para focar nos novos campos
          }, 1500);
        } else {
          showError(response?.message || "Erro ao enviar email.");
        }

      // --- PASSO 2: alterar senha usando token ---
      } else if (step === 2) {
        // Validação contra refresh da página
        if (!formData.email) {
            showError("O email é necessário. Por favor, volte e preencha novamente.");
            setLoading(false);
            return;
        }

        if (!formData.token || !formData.token.trim()) {
          showError("Digite o token enviado no email.");
          setLoading(false);
          return;
        }

        if (!formData.password || formData.password.length < 6) {
          showError("A senha deve ter pelo menos 6 caracteres.");
          setLoading(false);
          return;
        }

        // Chama o service que faz POST /alterar-senha/api com { email, novaSenha, token }
        const response = await alterarSenha({
          email: formData.email,
          novaSenha: formData.password, // Mapeamento do campo 'password' para 'novaSenha' do backend
          token: formData.token,
        });

        if (response && response.success) {
          showSuccess(response.message || "Senha alterada com sucesso!");
          // redireciona para /login após pequena pausa
          setTimeout(() => navigate("/login"), 2000);
        } else {
          showError(response?.message || "Token inválido ou expirado.");
        }
      }
    } catch (err: any) {
      console.error("Erro no fluxo de recuperação:", err?.response?.data || err?.message || err);
      // Tratamento robusto para pegar a mensagem de erro
      const msg = err.response?.data?.message || err.message || "Ocorreu um erro inesperado.";
      showError(msg);
    } finally {
      setLoading(false);
    }
  };

  /** Renderiza barra de progresso */
  const renderProgress = () => (
    <div className={styles.progressBar}>
      <div
        className={styles.progressFill}
        style={{ width: step === 1 ? "50%" : "100%" }}
      />
    </div>
  );

  // === JSX retornado pelo componente ===
  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        {renderProgress()}

        {/* Título dinâmico */}
        <h1>{step === 1 ? "Recuperar Senha" : "Criar Nova Senha"}</h1>

        {/* MENSAGENS DE FEEDBACK */}
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        {/* CAMPO DE EMAIL 
            Fica visível em ambos os passos. No passo 2, disabled para referência.
        */}
        <div className={styles.inputGroup}>
            <p>{step === 1 ? "Digite seu email para receber o código." : "Email da conta:"}</p>
            <input
                type="email"
                name="email"
                placeholder="Seu email cadastrado"
                value={formData.email}
                onChange={handleChange}
                className={`${styles.input} ${error ? styles.inputError : ""}`}
                required
                disabled={step === 2 && formData.email.length > 0} // Desabilita se já no passo 2 e com email preenchido
                autoFocus={step === 1}
            />
        </div>

        {/* CAMPOS EXCLUSIVOS DO PASSO 2 */}
        {step === 2 && (
          <div className={styles.stepTwoContainer}>
            <p>Insira o token recebido e sua nova senha.</p>
            
            {/* input do token — name "token" */}
            <input
              type="text"
              name="token"
              placeholder="Token de verificação"
              value={formData.token}
              onChange={handleChange}
              className={`${styles.input} ${error ? styles.inputError : ""}`}
              required
              autoComplete="off"
              autoFocus // Foca automaticamente no token ao avançar
            />

            {/* input da nova senha — name "password" */}
            <input
              type="password"
              name="password"
              placeholder="Nova senha"
              value={formData.password}
              onChange={handleChange}
              className={`${styles.input} ${error ? styles.inputError : ""}`}
              required
              minLength={6}
            />
          </div>
        )}

        {/* GRUPO DE BOTÕES */}
        <div className={styles.buttonGroup}>
            {/* Botão de Voltar (Apenas no passo 2) */}
            {step === 2 && (
                <button 
                    type="button" 
                    className={`${styles.button} ${styles.buttonSecondary}`} 
                    onClick={handleBack}
                    disabled={loading}
                >
                    Voltar
                </button>
            )}

            {/* Botão Principal de Submit */}
            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? "Processando..." : step === 1 ? "Enviar Código" : "Alterar Senha"}
            </button>
        </div>
      </form>
    </div>
  );
};

export default RecuperacaoSenha;