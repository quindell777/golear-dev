// src/components/NewsModal/NewsModal.tsx
import React from "react";
import type { NewsItem } from "../../../types"; // @ Importa o tipo NewsItem que criamos
import styles from "./NewsModal.module.scss"; // @ Estilos específicos para o modal

interface Props {
  newsList: NewsItem[]; // @ Lista de notícias recebida como prop
  onClose: () => void;  // @ Função para fechar o modal
}

const NewsModal: React.FC<Props> = ({ newsList, onClose }) => {
  return (
    // @ Overlay escurecido atrás do modal
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* @ Botão de fechar o modal */}
        <button className={styles.closeBtn} onClick={onClose}>
          &times; {/* @ Símbolo "X" para fechar */}
        </button>

        {/* @ Título principal do modal */}
        <h2>Notícias do dia</h2>

        {/* @ Itera sobre a lista de notícias para exibir todas */}
        {newsList.map((news, idx) => (
          <div key={idx} className={styles.newsItem}>
            <strong>{news.title}</strong> {/* @ Título da notícia */}
            {news.subtitle && <p>{news.subtitle}</p>} {/* @ Subtítulo, se existir */}
            <a href={news.url} target="_blank" rel="noopener noreferrer">
              Ler notícia completa {/* @ Link externo para abrir em nova aba */}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsModal;
