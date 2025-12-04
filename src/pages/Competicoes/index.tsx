// src/pages/Competicoes/CompeticoesPage.tsx

import React, { useEffect, useState, useRef } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import CompeticaoCard from "../../components/CompeticaoCard";
import CompeticaoModal from "../../components/Modals/CompeticaoModal";
import { listarCompeticoes } from "../../services/competicoes";
import type { Competicao } from "../../types";
import styles from "./CompeticoesPage.module.scss";
import { useAuth } from "../../context/AuthContext";
import NavBar from "../../components/NavBar";

const CompeticoesPage: React.FC = () => {
  const { user, loadingAuth } = useAuth();
  const usuarioId = user ? Number(user.sub) : null;
  const usuarioRole = user?.role || "";

  const [competicoes, setCompeticoes] = useState<Competicao[]>([]);
  const [loadingPage, setLoadingPage] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const modalRef = useRef(null); // Ref para o modal

  useEffect(() => {
    if (!loadingAuth && usuarioId) {
      const fetchData = async () => {
        setLoadingPage(true);
        try {
          const data = await listarCompeticoes();
          setCompeticoes(data);
        } catch (err) {
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

  const handleCreated = (nova: Competicao) => {
    setCompeticoes((prev) => [...prev, nova]);
    setMessage("Competição criada com sucesso!");
  };

  if (loadingAuth) {
    return <div className={styles.feedback}>Verificando autenticação...</div>;
  }

  if (!usuarioId) {
    return <div className={styles.feedback}>Usuário não autenticado.</div>;
  }

  if (loadingPage) {
    return <div className={styles.feedback}>Carregando competições...</div>;
  }

  return (
    <div className={styles.page}>
      <NavBar />
      <header className={styles.header}>
        <h1>Competições</h1>
        {usuarioRole === "Clube" && (
          <button
            className={styles.primaryButton}
            onClick={() => setModalOpen(true)}
          >
            Nova Competição
          </button>
        )}
      </header>

      {message && <div className={styles.message}>{message}</div>}

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
        <TransitionGroup className={styles.cardsContainer}>
          {competicoes.map((c) => {
            const nodeRef = React.createRef<HTMLDivElement>();
            return (
              <CSSTransition key={c.id} timeout={300} classNames="fade" nodeRef={nodeRef}>
                <div ref={nodeRef}>
                  <CompeticaoCard
                    competicao={c}
                  />
                </div>
              </CSSTransition>
            );
          })}
        </TransitionGroup>
      )}

      <CSSTransition
        nodeRef={modalRef}
        in={modalOpen}
        timeout={300}
        classNames="fade"
        unmountOnExit
      >
        <div ref={modalRef}>
          <CompeticaoModal
            onClose={() => setModalOpen(false)}
            onCreated={handleCreated}
          />
        </div>
      </CSSTransition>
    </div>
  );
};

export default CompeticoesPage;