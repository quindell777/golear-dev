// src/services/newsAPI.ts
import axios from "axios";
import type { NewsItem } from "../types"; // @ Tipo de notícia

const API_BASE = "https://api.apitube.io/v1/news"; // @ Endpoint base da API de notícias
const API_TOKEN = import.meta.env.VITE_APITUBE_TOKEN; // @ Token de autenticação do .env

// @ Função que faz a chamada real para a API APITube
export const fetchNews = async (): Promise<NewsItem[]> => {
  try {
    const res = await axios.get<{ articles: NewsItem[] }>(API_BASE, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`, // @ Token enviado no header
        Accept: "application/json",
      },
      params: {
        category: "soccer", // @ Notícias de futebol
        country: "BR",      // @ Do Brasil
        limit: 10,          // @ No máximo 10 resultados
      },
    });

    return res.data.articles || []; // @ Retorna os artigos ou array vazio
  } catch (err) {
    console.error("Erro ao buscar notícias APITube:", err);
    return []; // @ Em caso de erro, retorna array vazio
  }
};
