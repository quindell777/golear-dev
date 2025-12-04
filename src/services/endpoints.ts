// src/services/endpoints.ts
/**
 * @file endpoints.ts
 * @description
 * Lista centralizada de todos os endpoints da API GoLear.
 * Permite usar aliases claros para todas as rotas, evitando erros de digitação
 * e facilitando manutenção e refatoração.
 *
 * @example
 * import { ENDPOINTS } from './endpoints';
 * import { request } from './api';
 *
 * await request({ url: ENDPOINTS.login, method: "POST", data: {...} });
 */

export const ENDPOINTS = {
  health: "/health",
  root: "/",

  // Autenticação
  login: "/auth/login/api",
  register: "/auth/register/api",
  resgateSenha: "/resgate-senha/api",
  alterarSenha: "/alterar-senha/api",

  // Posts e Feed
  posts: "/posts",
  feed: "/feed/api",

  // Perfis e Usuários
  profile: "/profile/api",
  playersSearch: "/players/search",

  // Peneiras
  peneiras: "/peneiras/api",

  // Análises
  analises: "/analises/api",

  // Competições
  competicoes: "/competicoes/api",

  // Planos e Assinaturas
  planos: "/planos/api",
  assinaturas: "/assinaturas/api",
  pagamentos: "/pagamentos/api",

  // Compras
  compraPlano: "/compra-do-plano/api",
  verificarCompra: "/auth/compra/api",
  efetivarCompra: "/efetivacao-compra/api",
};
