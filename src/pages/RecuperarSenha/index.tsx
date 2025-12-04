// src/pages/RecuperarSenha/RecuperarSenha.tsx

// Importa React e hooks necessários
import React, { useState } from "react";
// Importa hook de navegação do react-router (para redirecionar após sucesso)
import { useNavigate } from "react-router-dom";
// Importa estilos via CSS Modules (isolamento de classes)
import styles from "./RecuperarSenha.module.scss";
// Importa os services que encapsulam as requisições HTTP
import { enviarEmailRecuperacao, alterarSenha } from "../../services/recuperarSenha";

/**
 * @interface StepFormData
 * @description Estrutura dos dados do formulário usados nos dois passos.
 */
interface StepFormData {
  /** Email para solicitar token e também usado na alteração de senha */
  email: string;
  /** Token recebido por email (passo 2) */
  token: string;
  /** Nova senha (passo 2) */
  password: string;
}

/**
 * @component RecuperacaoSenha
 * @description
 * Componente que implementa o fluxo de recuperação de senha em 2 passos:
 * 1) Enviar email (request para /resgate-senha/api)
 * 2) Informar token + nova senha (POST para /alterar-senha/api)
 *
 * O componente delega as chamadas HTTP aos services e apenas cuida da UX/validação.
 */
const RecuperacaoSenha: React.FC = () => {
  // hook para redirecionar o usuário (ex.: para /login após sucesso)
  const navigate = useNavigate();

  // state para controlar o passo atual (1 ou 2)
  const [step, setStep] = useState<1 | 2>(1);

  // state que contém todos os campos do formulário (email, token, nova senha)
  const [formData, setFormData] = useState<StepFormData>({
    email: "",   // inicia vazio
    token: "",   // inicia vazio
    password: "" // inicia vazio
  });

  // state que controla se o formulário está processando (desabilita botão)
  const [loading, setLoading] = useState(false);

  // state para mensagens de erro exibidas ao usuário
  const [error, setError] = useState("");

  // state para mensagens de sucesso exibidas ao usuário
  const [success, setSuccess] = useState("");

  /**
   * showError
   * @description Define mensagem de erro e limpa mensagem de sucesso.
   * @param msg Mensagem de erro a ser exibida.
   */
  const showError = (msg: string) => {
    setError(msg);    // define erro
    setSuccess("");   // limpa sucesso
  };

  /**
   * showSuccess
   * @description Define mensagem de sucesso e limpa mensagem de erro.
   * @param msg Mensagem de sucesso a ser exibida.
   */
  const showSuccess = (msg: string) => {
    setSuccess(msg);  // define sucesso
    setError("");     // limpa erro
  };

  /**
   * handleChange
   * @description Atualiza dinamicamente `formData` quando inputs mudam.
   * @param e Evento de input (input text/email/password)
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // extrai name e value do input que disparou o evento
    const { name, value } = e.target;

    // atualiza apenas o campo alterado mantendo os demais valores do formData
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * handleSubmit
   * @description Função principal que lida com o submit do formulário em ambos os passos.
   * - Se step === 1: valida email e chama enviarEmailRecuperacao()
   * - Se step === 2: valida token e senha e chama alterarSenha()
   *
   * @param e Evento de submit do formulário
   * @returns Promise<void>
   */
  const handleSubmit = async (e: React.FormEvent) => {
    // evita comportamento padrão do form (reload)
    e.preventDefault();

    // limpa mensagens e ativa indicador de carregamento
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // --- PASSO 1: enviar email para gerar token ---
      if (step === 1) {
        // validação simples de email (pode substituir por regex se preferir)
        if (!formData.email || !formData.email.includes("@")) {
          showError("Digite um email válido.");
          return;
        }

        // chama o service que faz POST /resgate-senha/api
        const response = await enviarEmailRecuperacao({ email: formData.email });

        // se backend retornou success=true, avança para passo 2 com feedback
        if (response && response.success) {
          showSuccess(response.message || "Email de recuperação enviado com sucesso!");
          // aguarda um pouco para o usuário ver a mensagem e então avança o passo
          setTimeout(() => setStep(2), 1200);
        } else {
          // caso backend retorne success:false exibe mensagem
          showError(response?.message || "Erro ao enviar email de recuperação.");
        }

      // --- PASSO 2: alterar senha usando token ---
      } else if (step === 2) {
        // valida token não vazio
        if (!formData.token || !formData.token.trim()) {
          showError("Digite o token enviado no email.");
          return;
        }

        // valida nova senha (mínimo 6 caracteres — ajuste conforme regra do backend)
        if (!formData.password || formData.password.length < 6) {
          showError("A senha deve ter pelo menos 6 caracteres.");
          return;
        }

        // chama o service que faz POST /alterar-senha/api com { email, novaSenha, token }
        const response = await alterarSenha({
          email: formData.email,
          novaSenha: formData.password,
          token: formData.token,
        });

        // se sucesso, mostra mensagem e redireciona para login
        if (response && response.success) {
          showSuccess(response.message || "Senha alterada com sucesso!");
          // redireciona para /login após pequena pausa
          setTimeout(() => navigate("/login"), 1500);
        } else {
          // se backend não conseguiu alterar, exibe a mensagem retornada
          showError(response?.message || "Erro ao alterar senha.");
        }
      }
    } catch (err: any) {
      // log para desenvolvedor com fallback informativo
      console.error("Erro no fluxo de recuperação:", err?.response?.data || err?.message || err);
      // mostra mensagem de erro amigável ao usuário
      showError(err?.response?.data?.message || "Erro ao processar sua solicitação.");
    } finally {
      // desativa indicador de carregamento sempre
      setLoading(false);
    }
  };

  /**
   * renderProgress
   * @description pequena barra de progresso que indica visualmente se estamos no passo 1 (50%) ou passo 2 (100%).
   * É separada por clareza; o JSX principal chama essa função.
   */
  const renderProgress = () => (
    <div className={styles.progressBar}>
      <div
        className={styles.progressFill}
        // width muda conforme o valor de `step`
        style={{ width: step === 1 ? "50%" : "100%" }}
      />
    </div>
  );

  // === JSX retornado pelo componente ===
  return (
    <div className={styles.container}>
      {/* formulário principal */}
      <form className={styles.form} onSubmit={handleSubmit}>
        {/* barra de progresso */}
        {renderProgress()}

        {/* título dinâmico conforme passo */}
        <h1>{step === 1 ? "Recuperar senha" : "Redefinir senha"}</h1>

        {/* PASSO 1: solicita email */}
        {step === 1 && (
          <>
            <p>Digite o email da sua conta para recuperar o acesso.</p>

            {/* input de email — name "email" é usado por handleChange */}
            <input
              type="email"
              name="email"
              placeholder="Seu email"
              value={formData.email}                // valor controlado pelo state
              onChange={handleChange}               // atualiza state ao digitar
              className={`${styles.input} ${error ? styles.inputError : ""}`} // aplica estilo de erro se necessário
              required                              // validação HTML5
            />
          </>
        )}

        {/* PASSO 2: token + nova senha */}
        {step === 2 && (
          <>
            <p>Digite o token enviado para seu email e a nova senha.</p>

            {/* input do token — name "token" */}
            <input
              type="text"
              name="token"
              placeholder="Token de verificação"
              value={formData.token}
              onChange={handleChange}
              className={`${styles.input} ${error ? styles.inputError : ""}`}
              required
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
            />
          </>
        )}

        {/* exibe erro se existir */}
        {error && <p className={styles.error}>{error}</p>}

        {/* exibe sucesso se existir */}
        {success && <p className={styles.success}>{success}</p>}

        {/* botão de submit — texto dinâmico conforme o passo; disabled durante loading */}
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "Processando..." : step === 2 ? "Confirmar" : "Próximo"}
        </button>
      </form>
    </div>
  );
};

// export default do componente para uso nas rotas
export default RecuperacaoSenha;
