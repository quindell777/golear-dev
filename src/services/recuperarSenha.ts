// src/services/recuperarSenha.ts

// Importa a instância central do Axios (api.ts)
import api from "./api";

// --- Interfaces de Entrada (Payloads) ---

export interface EnviarEmailPayload {
  email: string;
}

export interface AlterarSenhaPayload {
  email: string;
  novaSenha: string; // Backend espera 'novaSenha'
  token: string;
}

// --- Interfaces de Saída (Respostas do Backend) ---

export interface EnviarEmailResponse {
  success: boolean;
  message?: string;
}

export interface AlterarSenhaResponse {
  success: boolean;
  message?: string;
}

// --- Funções do Service ---

/**
 * Envia o email de recuperação.
 * Endpoint: POST /resgate-senha/api
 */
export async function enviarEmailRecuperacao(
  payload: EnviarEmailPayload
): Promise<EnviarEmailResponse> {
  try {
    // Usamos o Generic <EnviarEmailResponse> para tipar a resposta
    const response = await api.post<EnviarEmailResponse>("/resgate-senha/api", payload);
    
    return response.data;
  } catch (error: any) {
    console.error(
      "Erro service enviarEmailRecuperacao:", 
      error.response?.data || error.message
    );
    throw error;
  }
}

/**
 * Altera a senha usando o token.
 * Endpoint: POST /alterar-senha/api
 */
export async function alterarSenha(
  payload: AlterarSenhaPayload
): Promise<AlterarSenhaResponse> {
  try {
    // Passamos o payload com email, novaSenha e token
    const response = await api.post<AlterarSenhaResponse>("/alterar-senha/api", payload);
    
    return response.data;
  } catch (error: any) {
    console.error(
      "Erro service alterarSenha:", 
      error.response?.data || error.message
    );
    throw error;
  }
}