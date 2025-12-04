import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import type { Peneira } from "../../types";
import {
  listarPeneiras,
  criarPeneira,
  inscreverPeneira,
  desinscreverPeneira,
} from "../../services/peneiras";
import styles from "./PeneirasPageTeste.module.scss";
// NOVOS ÍCONES IMPORTADOS
import { FaFutbol, FaMapMarkerAlt, FaCalendarAlt, FaUserCheck, FaCrosshairs, FaMap, FaUserFriends } from "react-icons/fa";
import NavBar from "../../components/NavBar";

const PeneirasPageTeste: React.FC = () => {
  const { user } = useAuth();
  const [peneiras, setPeneiras] = useState<Peneira[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPeneira, setEditingPeneira] = useState<Peneira | null>(null);
  
  // ESTADOS BÁSICOS
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [local, setLocal] = useState("");
  const [dataEvento, setDataEvento] = useState("");
  
  // NOVOS ESTADOS ADICIONADOS (DO PRIMEIRO ARQUIVO)
  const [estado, setEstado] = useState(""); 
  const [idadeMinima, setIdadeMinima] = useState<number | string>(""); 
  const [posicao, setPosicao] = useState(""); 
  const [detalhes, setDetalhes] = useState(""); 
  const [objetivo, setObjetivo] = useState(""); 
  
  const [message, setMessage] = useState("");
  const [inscricoes, setInscricoes] = useState(new Set<number>());

  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(5);
  const [selectedPeneira, setSelectedPeneira] = useState<Peneira | null>(null);

  useEffect(() => {
    const fetchPeneiras = async () => {
      setLoading(true);
      try {
        const data = await listarPeneiras();
        setPeneiras(data);
      } catch (err: any) {
        console.error(err);
        setMessage("Erro ao carregar peneiras.");
      } finally {
        setLoading(false);
      }
    };
    fetchPeneiras();
  }, []);

  const toggleExpand = (peneira: Peneira) => {
    setExpandedId((prev) => (prev === peneira.id ? null : peneira.id));
    setSelectedPeneira((prev) => (prev?.id === peneira.id ? null : peneira));
  };

  const handleLoadMore = () => setVisibleCount((prev) => Math.min(prev + 5, peneiras.length));

  const openModal = (peneira?: Peneira) => {
    if (peneira) {
      setEditingPeneira(peneira);
      setTitulo(peneira.titulo);
      setDescricao(peneira.descricao);
      setLocal(peneira.local);
      setDataEvento(peneira.data_evento.slice(0, 16));
      
      // CARREGAR NOVOS CAMPOS PARA EDIÇÃO
      setEstado(peneira.estado || "");
      // Ajuste para carregar corretamente (assumindo que o tipo Peneira usa 'idade')
      setIdadeMinima(peneira.idade || ""); 
      setPosicao(peneira.posicao || "");
      setDetalhes(peneira.detalhes || "");
      setObjetivo(peneira.objetivo || "");
      
    } else {
      setEditingPeneira(null);
      setTitulo("");
      setDescricao("");
      setLocal("");
      setDataEvento("");
      
      // LIMPAR NOVOS CAMPOS PARA CRIAÇÃO
      setEstado("");
      setIdadeMinima("");
      setPosicao("");
      setDetalhes("");
      setObjetivo("");
    }
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleCreate = async () => {
    // ATUALIZAÇÃO DA VALIDAÇÃO PARA INCLUIR NOVOS CAMPOS OBRIGATÓRIOS
    if (!titulo || !descricao || !local || !dataEvento || !estado || !idadeMinima) {
      setMessage("Preencha todos os campos obrigatórios.");
      return;
    }
    
    // Ajuste de permissão (assumindo que Clubes e Olheiros podem criar)
    const rolesPermitidas = ["Olheiro"];
    if (!user || !rolesPermitidas.includes(user.role)) {
      setMessage("Apenas Olheiros podem criar peneiras.");
      return;
    }

    try {
      const dataISO = new Date(dataEvento).toISOString();
      
      // PAYLOAD ATUALIZADO COM TODOS OS NOVOS CAMPOS
      const peneiraData = {
        titulo,
        descricao,
        local,
        data_evento: dataISO,
        estado,
        idade: Number(idadeMinima), // Usando 'idade' para consistência de tipagem (como ajustado no chat)
        posicao: posicao || null,
        detalhes: detalhes || null,
        objetivo: objetivo || null,
      };
      
      const peneiraId = await criarPeneira(peneiraData as any);
      
      const newPeneira: Peneira = {
        id: peneiraId,
        ...peneiraData,
        createdAt: new Date().toISOString(),
      } as any; 
      
      setPeneiras((prev) => [...prev, newPeneira]);
      setMessage("Peneira criada com sucesso!");
      closeModal();
    } catch (err: any) {
      console.error(err);
      setMessage(err?.message || "Erro ao criar peneira.");
    }
  };

  const handleToggleInscricao = async (peneiraId: number) => {
    if (user?.role !== "Jogador") return;

    const isSubscribed = inscricoes.has(peneiraId);
    try {
      if (isSubscribed) {
        await desinscreverPeneira(peneiraId);
        setInscricoes((prev) => {
          const newSet = new Set(prev);
          newSet.delete(peneiraId);
          return newSet;
        });
        setMessage("Inscrição cancelada.");
      } else {
        await inscreverPeneira(peneiraId);
        setInscricoes((prev) => new Set(prev).add(peneiraId));
        setMessage("Inscrição realizada com sucesso!");
      }
    } catch (err: any) {
      console.error(err);
      setMessage(err.message || "Ocorreu um erro.");
    }
  };

  if (!user) return <div className={styles.feedback}>Usuário não autenticado.</div>;
  if (loading) return <div className={styles.feedback}>Carregando peneiras...</div>;

  return (
    <div className={styles.appContainer}>
      <NavBar />

      <header className={styles.header}>
        <h1>Peneiras de Futebol</h1>
        <button
          className={styles.addJobButtonSidebar}
          onClick={() => openModal()}
          // ATUALIZADO: Permitir Clube OU Olheiro no botão
          disabled={ user.role !== "Olheiro" }
        >
          + Criar Peneira
        </button>
      </header>

      {message && <div className={styles.message}>{message}</div>}

      <div className={styles.jobsContainer}>
        <aside className={styles.sidebar}>
          {peneiras.length === 0 ? (
            <div className={styles.feedback}>Nenhuma peneira disponível no momento.</div>
          ) : (
            <>
              <div className={styles.cardsContainer}>
                {peneiras.slice(0, visibleCount).map((p) => {
                  const isExpanded = expandedId === p.id;
                  return (
                    <div
                      key={p.id}
                      className={`${styles.cardWrapper} ${
                        isExpanded ? styles.expandedWrapper : ""
                      }`}
                    >
                      <div
                        className={`${styles.card} ${isExpanded ? styles.selected : ""}`}
                        onClick={() => toggleExpand(p)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") toggleExpand(p);
                        }}
                      >
                        <div className={styles.cardHeader}>
                          <div className={styles.cardHeaderLeft}>
                            <FaFutbol className={styles.icon} />
                            <h3 className={styles.title}>{p.titulo}</h3>
                          </div>
                          <div className={styles.cardHeaderRight}>
                            <span className={styles.chevron}>{isExpanded ? "▾" : "▸"}</span>
                          </div>
                        </div>
                        <p className={styles.descriptionPreview}>{p.descricao}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {visibleCount < peneiras.length && (
                <button className={styles.loadMoreButton} onClick={handleLoadMore}>
                  Carregar mais
                </button>
              )}
            </>
          )}
        </aside>

        {/* Painel de detalhes */}
        <main className={styles.details}>
          <h2>Visão rápida</h2>
          <p className={styles.helpText}>
            Clique em uma peneira para ver detalhes e ações.
          </p>
          <hr />
          {selectedPeneira ? (
            <>
              <h3>{selectedPeneira.titulo}</h3>
              <p>{selectedPeneira.descricao}</p>
              
              {/* EXIBIÇÃO DOS DADOS BÁSICOS E NOVOS */}
              <div className={styles.infoBlock}>
                <p>
                  <FaMapMarkerAlt /> Local: {selectedPeneira.local}
                </p>
                <p>
                  <FaMap /> Estado/UF: {selectedPeneira.estado}
                </p>
                <p>
                  <FaCalendarAlt /> Data: {new Date(selectedPeneira.data_evento).toLocaleDateString("pt-BR")}
                </p>
              </div>

              <div className={styles.detailsBlock}>
                <p>
                  <FaUserFriends /> Idade Mínima: {selectedPeneira.idade} anos
                </p>
                {selectedPeneira.posicao && (
                  <p>
                    <FaCrosshairs /> Posição: {selectedPeneira.posicao}
                  </p>
                )}
                <p>
                    Objetivo: {selectedPeneira.objetivo}
                </p>
                {selectedPeneira.detalhes && (
                    <p>
                      Detalhes Adicionais: {selectedPeneira.detalhes}
                    </p>
                )}
              </div>
              
              {/* FIM DA EXIBIÇÃO DOS NOVOS DADOS */}

              <button
                onClick={() => handleToggleInscricao(selectedPeneira.id)}
                className={
                  inscricoes.has(selectedPeneira.id)
                    ? styles.subscribedButton
                    : styles.subscribeButton
                }
                disabled={user.role !== "Jogador"}
              >
                <FaUserCheck /> {inscricoes.has(selectedPeneira.id) ? "Inscrito" : "Inscrever-se"}
              </button>
            </>
          ) : (
            <div className={styles.detailEmpty}>
              <p>Selecione uma peneira para informações específicas.</p>
            </div>
          )}
        </main>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>{editingPeneira ? "Editar Peneira" : "Nova Peneira"}</h2>

            <label>Título</label>
            <input value={titulo} onChange={(e) => setTitulo(e.target.value)} />

            <label>Descrição</label>
            <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} />

            <label>Local</label>
            <input value={local} onChange={(e) => setLocal(e.target.value)} />

            <label>Data e Hora do Evento</label>
            <input
              type="datetime-local"
              value={dataEvento}
              onChange={(e) => setDataEvento(e.target.value)}
            />
            
            {/* NOVOS CAMPOS NO MODAL */}
            <label>Estado/UF</label>
            <input value={estado} onChange={(e) => setEstado(e.target.value)} placeholder="Ex: MG, SP, RJ" />
            
            <label>Idade Mínima Requerida</label>
            <input 
              type="number"
              value={idadeMinima} 
              onChange={(e) => setIdadeMinima(e.target.value)} 
              min="5" 
            />
            
            <label>Posição (Opcional)</label>
            <input value={posicao} onChange={(e) => setPosicao(e.target.value)} placeholder="Ex: Zagueiro, Goleiro, Atacante" />
            
            <label>Objetivo da Peneira (Opcional)</label>
            <textarea value={objetivo} onChange={(e) => setObjetivo(e.target.value)} placeholder="Ex: Selecionar 5 atletas para a categoria Sub-15." />
            
            <label>Detalhes Adicionais (Opcional)</label>
            <textarea value={detalhes} onChange={(e) => setDetalhes(e.target.value)} placeholder="Ex: Trazer chuteira de campo, taxa de inscrição de R$50." />
            {/* FIM DOS NOVOS CAMPOS */}

            <div className={styles.modalActions}>
              <button className={styles.cancelButton} onClick={closeModal}>
                Cancelar
              </button>
              <button
                className={styles.submitButton}
                onClick={handleCreate}
                disabled={ user.role !== "Olheiro" }
              >
                {editingPeneira ? "Salvar" : "Criar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PeneirasPageTeste;