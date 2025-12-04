// src/services/searchService.ts
import api from "./api";
import type { Profile } from "../types";

export const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

interface SearchResponse {
  success: boolean;
  data: Profile[];
}

/**
 * @function searchUsers
 * @description Busca usuários filtrando por múltiplos parâmetros.
 * @param {Object} filters - Parâmetros de busca (role, nome, etc.)
 */
export async function searchUsers(filters: Record<string, string>): Promise<Profile[]> {
  try {
    const response = await api.get<SearchResponse>("/api/players/search", {
      params: filters,
    });

    if (response.data.success) {
      return response.data.data.map(p => ({
        ...p,
        profilePictureUrl: p.profilePictureUrl || DEFAULT_AVATAR
      }));
    } else {
      console.warn("Busca de usuários não retornou sucesso.");
      return [];
    }
  } catch (error: any) {
    console.error("Erro ao buscar usuários:", error.response?.data || error.message);
    return [];
  }
}