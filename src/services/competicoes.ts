import api from "./api";
import type { Competicao, CompeticoesResponse } from "../types";

// Lista todas as competições
export const listarCompeticoes = async (): Promise<Competicao[]> => {
  const { data } = await api.get<CompeticoesResponse>("/competicoes/api");
  return data.competicoes;
};

// Cria uma nova competição
export const criarCompeticao = async (competicao: Partial<Competicao>): Promise<Competicao> => {
  const { data } = await api.post<Competicao>("/competicoes", competicao);
  return data;
};

// As funções abaixo dependem de endpoints que ainda não foram implementados no backend.
// Comentadas para evitar erros 404.

// // Deleta uma competição pelo ID
// export const deletarCompeticao = async (id: number): Promise<void> => {
//   await api.delete(`/competicoes/api/${id}`);
// };

// // Inscrever usuário em uma competição
// export const inscreverUsuario = async (competicaoId: number, usuarioId: number) => {
//   const { data } = await api.post(`/competicoes/api/${competicaoId}/inscricao`, { usuarioId });
//   return data;
// };

// // Cancelar inscrição de usuário
// export const cancelarInscricao = async (competicaoId: number, usuarioId: number) => {
//   const { data } = await api.delete(`/competicoes/api/${competicaoId}/inscricao/${usuarioId}`);
//   return data;
// };
