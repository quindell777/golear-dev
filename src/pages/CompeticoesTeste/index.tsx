import React, { useEffect, useState } from "react";
import CompeticaoModal from "../../components/Modals/CompeticaoModal";
import { listarCompeticoes } from "../../services/competicoes";
import type { Competicao } from "../../types";
import styles from "./CompeticoesPageTeste.module.scss";
import { useAuth } from "../../context/AuthContext";
import NavBar from "../../components/NavBar";

const CompeticoesPageTeste: React.FC = () => {
  const { user, loadingAuth } = useAuth();
  const usuarioId = user ? Number((user as any).sub) : null;
  const usuarioRole = (user as any)?.role || "";

  const [competicoes, setCompeticoes] = useState<Competicao[]>([]);
  const [loadingPage, setLoadingPage] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState("");

  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(5);
  const [selectedCompeticao, setSelectedCompeticao] = useState<Competicao | null>(null);

  // ---------------- Carregar competições ----------------
  useEffect(() => {
    if (!loadingAuth && usuarioId) {
      const fetchData = async () => {
        setLoadingPage(true);
        try {
          const data = await listarCompeticoes();
          setCompeticoes(data);
        } catch {
          setMessage("Erro ao carregar competições.");
        } finally {
          setLoadingPage(false);
        }
      };
      fetchData();
    } else if (!loadingAuth && !usuarioId) {
      setLoadingPage(false);
    }
  }, [usuarioId, loadingAuth]);

  // ---------------- Criar nova competição ----------------
  const handleCreated = (nova: Competicao) => {
    setCompeticoes((prev) => [...prev, nova]);
    setMessage("Competição criada com sucesso!");
  };

  // ---------------- Expandir / Selecionar ----------------
  const toggleExpand = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
    const comp = competicoes.find((c) => c.id === id) || null;
    setSelectedCompeticao((prev) => (prev?.id === id ? null : comp));
  };

  // ---------------- Carregar mais ----------------
  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 5, competicoes.length));
  };

  // ---------------- Renderizações condicionais ----------------
  if (loadingAuth) return <div className={styles.feedback}>Verificando autenticação...</div>;
  if (!usuarioId) return <div className={styles.feedback}>Usuário não autenticado.</div>;
  if (loadingPage) return <div className={styles.feedback}>Carregando competições...</div>;

  // ========================= Render =========================
  return (
    <div className={styles.appContainer}>
      <NavBar />

      <header className={styles.header}>
        <h1>Competições</h1>
        {usuarioRole === "Clube" && (
          <button
            className={styles.addJobButtonSidebar}
            onClick={() => setModalOpen(true)}
          >
            Nova Competição
          </button>
        )}
      </header>

      {message && <div className={styles.message}>{message}</div>}

      <div className={styles.jobsContainer}>
        {/* ---------------- Sidebar ---------------- */}
        <aside className={styles.sidebar}>
          {competicoes.length === 0 ? (
            <div className={styles.feedback}>
              <p>Nenhuma competição encontrada.</p>
              {usuarioRole === "Clube" && (
                <button
                  className={styles.secondaryButton}
                  onClick={() => setModalOpen(true)}
                >
                  Criar a primeira competição
                </button>
              )}
            </div>
          ) : (
            <>
              <div className={styles.cardsContainer}>
                {competicoes.slice(0, visibleCount).map((c) => {
                  const isExpanded = expandedId === c.id;
                  return (
                    <div key={c.id} className={styles.cardWrapper}>
                      <div
                        className={`${styles.jobCard} ${isExpanded ? styles.selected : ""}`}
                        onClick={() => toggleExpand(c.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") toggleExpand(c.id);
                        }}
                      >
                        <div className={styles.cardHead}>
                          <div>
                            <h4 className={styles.cardTitle}>{c.nome}</h4>
                          </div>
                          <div className={styles.cardRight}>
                            <span className={styles.cardDate}>
                              {c.data_inicio ? `Início: ${c.data_inicio}` : ""}
                            </span>
                            <span className={styles.chevron}>{isExpanded ? "▾" : "▸"}</span>
                          </div>
                        </div>
                        <div className={`${styles.cardExpanded} ${isExpanded ? "fadeSlide" : ""}`}>
                          <p className={styles.description}>{c.descricao}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {visibleCount < competicoes.length && (
                <button className={styles.loadMoreButton} onClick={handleLoadMore}>
                  Carregar mais
                </button>
              )}
            </>
          )}
        </aside>

        {/* ---------------- Painel de detalhes ---------------- */}
        <main className={styles.details}>
          <div
            className={`${styles.detailContent} ${
              selectedCompeticao ? styles.showDetail : ""
            }`}
          >
            {selectedCompeticao ? (
              <>
                <h2>{selectedCompeticao.nome}</h2>
                <p className={styles.helpText}>Início: {selectedCompeticao.data_inicio}</p>
                <p className={styles.helpText}>Fim: {selectedCompeticao.data_fim}</p>
                <hr />
                <p className={styles.description}>{selectedCompeticao.descricao}</p>

                {(user as any)?.role?.toLowerCase() === "jogador" && (
                  <button
                    className={styles.applyButtonDetails}
                    onClick={() => {
                      alert(`Você se inscreveu em ${selectedCompeticao.nome}`);
                    }}
                    title="Clique para se inscrever"
                  >
                    Inscrever-se
                  </button>
                )}
              </>
            ) : (
              <div className={styles.detailEmpty}>
                <h2>Visão rápida</h2>
                <p className={styles.helpText}>
                  Clique em uma competição na lista à esquerda para ver os detalhes.
                </p>
                <hr />
                <p>Nenhuma competição selecionada.</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ---------------- Modal ---------------- */}
      {modalOpen && (
        <div className={styles.modalOverlay} onClick={() => setModalOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <CompeticaoModal onClose={() => setModalOpen(false)} onCreated={handleCreated} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CompeticoesPageTeste;
