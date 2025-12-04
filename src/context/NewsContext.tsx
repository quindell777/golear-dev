// src/context/NewsContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import type { NewsItem } from "../types"; // @ Tipo NewsItem para tipagem
import { getNews } from "../services/serviceNews"; // @ Função principal para buscar notícias (cache + API)

interface NewsContextType {
  noticias: NewsItem[]; // @ Lista de notícias
  loading: boolean;     // @ Indicador de carregamento
  error: boolean;       // @ Indicador de erro
}

// @ Cria o contexto com valores padrão
const NewsContext = createContext<NewsContextType>({
  noticias: [],
  loading: true,
  error: false,
});

// @ Hook customizado para consumir o contexto de notícias
export const useNews = () => useContext(NewsContext);

interface Props {
  children: React.ReactNode; // @ Componentes filhos que terão acesso ao contexto
}

// @ Provider que envolve a aplicação e fornece as notícias para todos os filhos
export const NewsProvider: React.FC<Props> = ({ children }) => {
  const [noticias, setNoticias] = useState<NewsItem[]>([]); // @ Estado das notícias
  const [loading, setLoading] = useState(true);             // @ Estado de carregamento
  const [error, setError] = useState(false);               // @ Estado de erro

  // @ Função que busca notícias da API (ou do cache)
  const fetchNoticias = async () => {
    try {
      setLoading(true); // @ Ativa loading
      setError(false);  // @ Limpa erro anterior

      const data = await getNews(); // @ Busca notícias

      if (!data || data.length === 0) setError(true); // @ Caso não venha nada, seta erro
      setNoticias(data); // @ Atualiza estado
    } catch {
      setError(true);    // @ Marca erro se houver falha na requisição
      setNoticias([]);   // @ Limpa lista para evitar exibir dados antigos
    } finally {
      setLoading(false); // @ Finaliza loading
    }
  };

  // @ Busca notícias ao carregar o componente
  useEffect(() => {
    fetchNoticias();
  }, []);

  return (
    // @ Fornece os valores para os componentes filhos
    <NewsContext.Provider value={{ noticias, loading, error }}>
      {children}
    </NewsContext.Provider>
  );
};

export default NewsContext;
