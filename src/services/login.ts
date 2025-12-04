/**
 * @file login.ts
 * @description
 * Serviço responsável por autenticar usuários na API GoLear.
 * Utiliza a função genérica `request` do `services/api.ts`.
 *
 * @remarks
 * - Endpoint confirmado: POST /auth/login/api
 * - Body esperado: { email: string, password: string }
 * - Resposta esperada: { success, message, token, user }
 */

import { request } from "./api"; // função genérica de requisições

/* -------------------------------------------------------------------------- */
/*                               TIPAGEM DO LOGIN                              */
/* -------------------------------------------------------------------------- */

/**
 * @interface LoginPayload
 * @description Estrutura dos dados enviados para o backend no login.
 * @property email - email do usuário
 * @property password - senha do usuário
 */
export interface LoginPayload {
  email: string;
  password: string;
}

/**
 * @interface LoginResponse
 * @description Tipagem do retorno esperado da API ao fazer login.
 * @property success - indica sucesso da operação
 * @property message - mensagem do backend
 * @property token - JWT retornado pelo backend
 * @property user - dados básicos do usuário
 */
export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: {
    id: number;
    email: string;
    role: "Jogador" | "Clube" | "Olheiro";
    createdAt: string;
  };
}

/* -------------------------------------------------------------------------- */
/*                           FUNÇÃO DE LOGIN USUÁRIO                           */
/* -------------------------------------------------------------------------- */

/**
 * @function loginUser
 * @description Faz login do usuário no backend e retorna LoginResponse
 * @param payload - objeto com email e password
 * @returns Promise<LoginResponse> - dados retornados pelo backend (inclui token)
 *
 * @example
 * const res = await loginUser({ email: "x@y.com", password: "1234" });
 * // res.token -> JWT
 */
export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  try {
    // faz requisição ao endpoint de login; withAuth: false porque ainda não temos token
    const response = await request<LoginResponse>({
      url: "/auth/login/api",
      method: "POST",
      data: payload,
      withAuth: false, // não envia Authorization aqui
    });

    // retorna os dados brutos (backend já fornece token e usuário)
    return response.data;
  } catch (error: any) {
    // log detalhado para debug (mostra payload/response se disponível)
    console.error("Erro ao fazer login:", error.response?.data || error.message || error);
    // re-lança o erro para o chamador (ex.: componente de login) lidar
    throw error;
  }
}
