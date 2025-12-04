// src/services/recuperarSenha.ts

// Importa a instância central do Axios (api.ts) — já contém baseURL, interceptors, headers padrão.
import api from "./api";

/**
 * @interface EnviarEmailPayload
 * @description Payload esperado pelo endpoint de envio de email de recuperação.
 */
export interface EnviarEmailPayload {
  /** Email do usuário que receberá o token de recuperação */
  email: string;
}

/**
 * @interface AlterarSenhaPayload
 * @description Payload esperado pelo endpoint de alteração de senha.
 */
export interface AlterarSenhaPayload {
  /** Email do usuário cuja senha será alterada */
  email: string;
  /** Nova senha a ser aplicada */
  novaSenha: string;
  /** Token de recuperação recebido por email (string) */
  token: string;
}

/**
 * @interface EnviarEmailResponse
 * @description Tipagem simplificada da resposta esperada do backend ao enviar email.
 */
export interface EnviarEmailResponse {
  success: boolean;        // indica se o envio foi bem-sucedido
  message?: string;        // mensagem opcional do backend
  token?: string;          // o backend pode retornar um token (útil em testes)
}

/**
 * @interface AlterarSenhaResponse
 * @description Tipagem simplificada da resposta esperada do backend ao alterar senha.
 */
export interface AlterarSenhaResponse {
  success: boolean;        // indica se a alteração foi bem-sucedida
  message?: string;        // mensagem opcional do backend
}

/**
 * enviarEmailRecuperacao
 *
 * @description
 * Faz POST para `/resgate-senha/api` com o email do usuário.
 * Encapsula a chamada HTTP para manter o frontend desacoplado do endpoint.
 *
 * @param {EnviarEmailPayload} payload - { email }
 * @returns {Promise<EnviarEmailResponse>} - resposta do backend (response.data)
 *
 * @example
 * await enviarEmailRecuperacao({ email: "usuario@exemplo.com" });
 */
export async function enviarEmailRecuperacao(
  payload: EnviarEmailPayload
): Promise<EnviarEmailResponse> {
  // try/catch para capturar erros de rede / backend e repassá-los ao chamador
  try {
    // chama a instância `api` (axios) com POST, enviando apenas { email }
    const response = await api.post("/resgate-senha/api", { email: payload.email });

    // retorna response.data (convenção: evitar expor response inteiro aqui)
    return response.data as EnviarEmailResponse;
  } catch (error: any) {
    // log detalhado para desenvolvedor: tenta priorizar mensagem do backend quando disponível
    console.error(
      "Erro ao enviar email de recuperação:",
      error?.response?.data || error?.message || error
    );

    // rethrow para que o componente que chamou trate a UI (ex.: mostrar mensagem)
    throw error;
  }
}

/**
 * alterarSenha
 *
 * @description
 * Faz POST para `/alterar-senha/api` com { email, novaSenha, token }.
 * Observação: esse endpoint (conforme sua documentação) não exige Authorization header,
 * o token é enviado no corpo da requisição.
 *
 * @param {AlterarSenhaPayload} payload - { email, novaSenha, token }
 * @returns {Promise<AlterarSenhaResponse>} - resposta do backend (response.data)
 *
 * @example
 * await alterarSenha({ email: "u@e.com", novaSenha: "123456", token: "abc123" });
 */
export async function alterarSenha(
  payload: AlterarSenhaPayload
): Promise<AlterarSenhaResponse> {
  try {
    // Executa POST para o endpoint correto enviando o corpo requerido
    const response = await api.post("/alterar-senha/api", {
      email: payload.email,
      novaSenha: payload.novaSenha,
      token: payload.token,
    });

    // Retorna os dados que o backend devolve para o chamador
    return response.data as AlterarSenhaResponse;
  } catch (error: any) {
    // Log detalhado para debug
    console.error(
      "Erro ao alterar senha:",
      error?.response?.data || error?.message || error
    );

    // Repassa erro para o componente tratar a experiência do usuário
    throw error;
  }
}
