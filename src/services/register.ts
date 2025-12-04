// src/services/register.ts
import api from "./api";

/**
 * @interface RegisterPayload
 * @description Estrutura de dados esperada pelo backend para registrar novo usuário.
 */
export interface RegisterPayload {
  email: string;
  password: string;
  role: "Jogador" | "Clube" | "Olheiro";
  nome?: string;
  posicao?: string;
  cidade?: string;
  regiao?: string;
}

/**
 * @function registerUser
 * @description Faz POST para /auth/register/api com os dados de criação de usuário.
 * @param {RegisterPayload} payload - Objeto com email, senha, role e campos opcionais.
 * @returns {Promise<any>} Retorna token + dados do usuário criado.
 */
export async function registerUser(payload: RegisterPayload) {
  try {
    const response = await api.post("/auth/register/api", payload);
    return response.data;
  } catch (error: any) {
    console.error("Erro ao registrar usuário:", error.response?.data || error.message);
    throw error;
  }
}
