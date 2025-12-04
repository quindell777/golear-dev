// src/components/SidebarRight/SidebarRight.tsx
import React, { useState } from "react";
import styles from "./SidebarRight.module.scss"; // @ Estilos específicos para a sidebar
import { FiExternalLink } from "react-icons/fi"; // @ Ícone de link externo
import { useNews } from "../../context/NewsContext"; // @ Hook customizado para acessar notícias do contexto
import NewsModal from "../Modals/NewsModal"; // @ Componente modal para exibir lista completa de notícias
import UserRecommendations from "../UserRecommendations";

const SidebarRight: React.FC = () => {
  const { noticias, loading, error } = useNews(); // @ Pega do contexto: lista de notícias, estado de loading e de erro
  const [modalOpen, setModalOpen] = useState(false); // @ Controla se o modal está aberto ou fechado

  return (
    <aside className={styles.sidebar}>
      <section className={styles.block}>
        {/* @ Título da seção de notícias */}
        <h3 className={styles.blockTitle}>
          <FiExternalLink className={styles.icon} /> Notícias de Futebol
        </h3>

        {/* @ Exibe texto de carregamento enquanto busca notícias */}
        {loading && <p>Carregando notícias...</p>}

        {/* @ Caso a requisição falhe ou não haja notícias */}
        {!loading && error && <p>Nenhuma notícia disponível.</p>}

        {/* @ Lista apenas as 5 primeiras notícias para não poluir a sidebar */}
        {!loading &&
          !error &&
          noticias.slice(0, 5).map((item, idx) => (
            <div key={idx} className={styles.newsItem}>
              <strong>{item.title}</strong> {/* @ Título da notícia */}
              {item.subtitle && <p>{item.subtitle}</p>} {/* @ Subtítulo se existir */}
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                Link da notícia {/* @ Link externo abre em nova aba */}
              </a>
            </div>
          ))}

        {/* @ Botão para abrir o modal com todas as notícias */}
        {!loading && !error && noticias.length > 0 && (
          <button
            onClick={() => setModalOpen(true)}
            className={styles.viewMore}
          >
            Ver mais
          </button>
        )}

        <UserRecommendations />
      </section>

      

      {/* @ Renderiza o modal somente quando modalOpen for true */}
      {modalOpen && (
        <NewsModal newsList={noticias} onClose={() => setModalOpen(false)} />
      )}
    </aside>
  );
};

export default SidebarRight;
