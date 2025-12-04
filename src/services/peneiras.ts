/**
 * @file peneiras.ts
 * @description
 * Serviço responsável por gerenciar as peneiras da API GoLear.
 * Inclui listagem de peneiras e criação de novas peneiras.
 * Utiliza a função genérica `request` do `api.ts`.
 */

import { request } from "./api"; // Função genérica que suporta JWT e headers customizados
import type { Peneira, PeneirasResponse } from "../types";

/* -------------------------------------------------------------------------- */
/*                              LISTAR PENEIRAS                                */
/* -------------------------------------------------------------------------- */

/**
 * @function listarPeneiras
 * @description Busca todas as peneiras disponíveis na API.
 * Não requer autenticação.
 *
 * @returns {Promise<Peneira[]>} - Retorna um array de objetos `Peneira`.
 *
 * @example
 * const peneiras = await listarPeneiras();
 * console.log(peneiras[0].titulo);
 */
export const listarPeneiras = async (): Promise<Peneira[]> => {
  try {
    // Faz a requisição GET usando a função genérica
    const response = await request<PeneirasResponse>({
      url: "/peneiras/api",
      method: "GET",
      withAuth: false, // não requer token
    });

    // Retorna apenas o array de peneiras
    if (response.data.success) {
      return response.data.peneiras;
    } else {
      throw new Error(response.data.message || "Erro ao buscar peneiras.");
    }
  } catch (error) {
    console.error("Erro ao listar peneiras:", error);
    throw error;
  }
};

/* -------------------------------------------------------------------------- */
/*                              CRIAR PENEIRA                                  */
/* -------------------------------------------------------------------------- */

/**
 * @function criarPeneira
 * @description Cria uma nova peneira na API.
 * Requer autenticação com token JWT e role 'Olheiro'.
 *
 * @param {Omit<Peneira, "id" | "createdAt">} peneira - Dados da nova peneira
 * @returns {Promise<number>} - Retorna o ID da peneira criada
 *
 * @example
 * const id = await criarPeneira({
 *   titulo: "Peneira Goleiros",
 *   descricao: "Procuramos goleiros nascidos entre 2005 e 2007",
 *   local: "CT do Clube, São Paulo - SP",
 *   data_evento: "2026-01-20T09:00:00.000Z",
 * });
 */
export const criarPeneira = async (
  peneira: Omit<Peneira, "id" | "createdAt">
): Promise<number> => {
  try {
    const response = await request<{ success: boolean; message: string; peneiraId: number }>({
      url: "/peneiras",
      method: "POST",
      data: peneira,
      withAuth: true, // precisa de token
    });

    if (response.data.success) {
      return response.data.peneiraId;
    } else {
      throw new Error(response.data.message || "Erro ao criar peneira.");
    }
  } catch (error) {
    console.error("Erro ao criar peneira:", error);
    throw error;
  }
};

/* -------------------------------------------------------------------------- */
/*                         INSCRIÇÃO EM PENEIRAS                              */
/* -------------------------------------------------------------------------- */

export const inscreverPeneira = async (peneiraId: number): Promise<void> => {
  // O endpoint POST /peneiras/:id/inscrever não está documentado na API.
  // A funcionalidade foi desativada temporariamente no frontend para evitar erros.
  throw new Error(`A funcionalidade de inscrever-se na peneira (ID: ${peneiraId}) não está implementada no backend.`);

  /*
  await request({
    url: `/peneiras/${peneiraId}/inscrever`,
    method: "POST",
    withAuth: true,
  });
  */
};

export const desinscreverPeneira = async (peneiraId: number): Promise<void> => {
  // O endpoint DELETE /peneiras/:id/desinscrever não está documentado na API.
  // A funcionalidade foi desativada temporariamente no frontend para evitar erros.
  throw new Error(`A funcionalidade de desinscrever-se da peneira (ID: ${peneiraId}) não está implementada no backend.`);

  /*
  await request({
    url: `/peneiras/${peneiraId}/desinscrever`,
    method: "DELETE",
    withAuth: true,
  });
  */
};

