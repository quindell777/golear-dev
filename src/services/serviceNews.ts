// src/services/ServiceNews.ts
import type { NewsItem } from "../types"; // @ Tipo de notícia
import { fetchNews } from "./newsAPI";     // @ Função para buscar da API real

const CACHE_KEY = "newsCache";           // @ Chave para armazenar cache no localStorage
const CACHE_EXPIRY_HOURS = 12;          // @ Tempo de expiração do cache (12h)

// @ Estrutura do objeto de cache
interface CachedNews {
  timestamp: number; // @ Quando foi salvo
  data: NewsItem[];  // @ Lista de notícias
}

// @ Salva notícias no cache
export const saveNewsCache = (data: NewsItem[]) => {
  const cache: CachedNews = { timestamp: Date.now(), data };
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
};

// @ Carrega notícias do cache
export const loadNewsCache = (): NewsItem[] | null => {
  const raw = localStorage.getItem(CACHE_KEY);
  if (!raw) return null; // @ Se não houver cache

  try {
    const cache: CachedNews = JSON.parse(raw);
    const hoursElapsed = (Date.now() - cache.timestamp) / 1000 / 60 / 60;

    if (hoursElapsed > CACHE_EXPIRY_HOURS) return null; // @ Cache expirado
    return cache.data; // @ Retorna dados do cache
  } catch {
    return null; // @ Se der erro ao parsear, ignora cache
  }
};

// @ Função principal que decide entre cache ou API
export const getNews = async (): Promise<NewsItem[]> => {
  const cached = loadNewsCache(); // @ Tenta pegar do cache
  if (cached) return cached;      // @ Se existir cache válido, retorna

  const news = await fetchNews(); // @ Caso contrário, busca na API
  saveNewsCache(news);            // @ Salva no cache para futuras requisições
  return news;
};
