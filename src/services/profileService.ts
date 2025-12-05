/**
 * @file profileService.ts
 * @description
 * Serviço de perfil do usuário.
 * - Busca perfil do usuário logado ou por ID.
 * - Atualiza perfil via backend.
 */

import api from "./api";
import type { Profile } from "../types";

// ----------------------------
// Funções principais
// ----------------------------

/**
 * Busca o perfil do usuário logado.
 */
export async function getProfile(): Promise<Profile> {
  const response = await api.get<{ user: any; profile: any }>("/profile/api");
  return { ...response.data.user, ...response.data.profile };
}

/**
 * Busca o perfil de um usuário específico pelo ID.
 * @param id - ID do usuário
 */
export async function getProfileById(id: string): Promise<Profile> {
  const response = await api.get<{ user: any; profile: any }>(`/usuarios/${id}/perfil`);
  return { ...response.data.user, ...response.data.profile };
}

/**
 * Atualiza o perfil do usuário.
 */
export async function updateProfile(payload: Partial<Profile>): Promise<any> {
  const response = await api.put("/profile/api", payload);
  return response.data;
}

/**
 * Verifica o status de conexão com um usuário.
 * @param targetUserId ID do usuário alvo
 */
export async function getConnectionStatus(targetUserId: string): Promise<boolean> {
  const response = await api.get<{ success: boolean; following: boolean }>(`/usuarios/${targetUserId}/connection-status`);
  return response.data.following;
}

/**
 * Conecta (segue) um usuário.
 * @param targetUserId ID do usuário a ser seguido
 */
export async function connectUser(targetUserId: string): Promise<any> {
  const response = await api.post(`/usuarios/${targetUserId}/conectar`);
  return response.data;
}

/**
 * Desconecta (deixa de seguir) um usuário.
 * @param targetUserId ID do usuário a ser deixado de seguir
 */
export async function disconnectUser(targetUserId: string): Promise<any> {
  const response = await api.delete(`/usuarios/${targetUserId}/desconectar`);
  return response.data;
}
