import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import type { Peneira } from "../../types"; 
import { listarPeneiras, criarPeneira, inscreverPeneira, desinscreverPeneira } from "../../services/peneiras";
import styles from "./PeneirasPage.module.scss";
import { FaFutbol, FaMapMarkerAlt, FaCalendarAlt, FaUserCheck, FaUserFriends, FaCrosshairs, FaMap } from "react-icons/fa";
import NavBar from "../../components/NavBar";

const PeneirasPage: React.FC = () => {
  const { user } = useAuth();
  const [peneiras, setPeneiras] = useState<Peneira[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPeneira, setEditingPeneira] = useState<Peneira | null>(null);
  
  // 1. NOVOS ESTADOS ADICIONADOS
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [local, setLocal] = useState("");
  const [dataEvento, setDataEvento] = useState("");
  const [estado, setEstado] = useState(""); // Novo
  const [idadeMinima, setIdadeMinima] = useState<number | string>(""); // Novo
  const [posicao, setPosicao] = useState(""); // Novo
  const [detalhes, setDetalhes] = useState(""); // Novo
  const [objetivo, setObjetivo] = useState(""); // Novo
  
  const [message, setMessage] = useState("");
  const [inscricoes, setInscricoes] = useState(new Set<number>());

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

  const openModal = (peneira?: Peneira) => {
    if (peneira) {
      setEditingPeneira(peneira);
      setTitulo(peneira.titulo);
      setDescricao(peneira.descricao);
      setLocal(peneira.local);
      setDataEvento(peneira.data_evento.slice(0, 16));
      
      // 2. CARREGAR DADOS EXISTENTES PARA EDIÇÃO
      setEstado(peneira.estado || "");
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
      
      // 3. LIMPAR NOVOS ESTADOS NA CRIAÇÃO
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
    try {
      if (!titulo || !descricao || !local || !dataEvento || !estado || !idadeMinima) {
        setMessage("Preencha todos os campos obrigatórios (Título, Descrição, Local, Data, Estado, Idade Mínima).");
        return;
      }
      if (!user || user.role !== "Olheiro") {
        setMessage("Apenas olheiros podem criar peneiras.");
        return;
      }
      
      const peneiraData = {
        titulo,
        descricao,
        local,
        data_evento: new Date(dataEvento).toISOString(),
        
        // 4. INCLUIR NOVOS DADOS NA CRIAÇÃO
        estado,
        idade_minima: Number(idadeMinima),
        posicao: posicao || null, // Permite ser opcional
        detalhes: detalhes || null, // Permite ser opcional
        objetivo: objetivo || null, // Permite ser opcional
      };
      
      const peneiraId = await criarPeneira(peneiraData as any); // Adicionei 'as any' temporariamente devido à tipagem
      
      const newPeneira = { 
          id: peneiraId, 
          createdAt: new Date().toISOString(), 
          ...peneiraData 
      } as Peneira;
      
      setPeneiras((prev) => [...prev, newPeneira]);
      setMessage("Peneira criada com sucesso!");
      closeModal();
    } catch (err: any) {
      console.error(err);
      setMessage(err.message || "Erro ao criar peneira.");
    }
  };

  const handleToggleInscricao = async (peneiraId: number) => {
    const isSubscribed = inscricoes.has(peneiraId);
    try {
      if (isSubscribed) {
        await desinscreverPeneira(peneiraId);
        setInscricoes(prev => {
          const newSet = new Set(prev);
          newSet.delete(peneiraId);
          return newSet;
        });
        setMessage("Inscrição cancelada.");
      } else {
        await inscreverPeneira(peneiraId);
        setInscricoes(prev => new Set(prev).add(peneiraId));
        setMessage("Inscrição realizada com sucesso!");
      }
    } catch (error: any) {
      console.error("Erro na operação de inscrição:", error);
      setMessage(error.message || "Ocorreu um erro.");
    }
  };

  if (!user) return <div className={styles.feedback}>Usuário não autenticado.</div>;
  if (loading) return <div className={styles.feedback}>Carregando peneiras...</div>;

  return (
    <div className={styles.page}>
      <NavBar />
      <header className={styles.header}>
        <h1>Peneiras de Futebol</h1>
        {user.role === "Olheiro" && (
          <button className={styles.primaryButton} onClick={() => openModal()}>
            + Criar Peneira
          </button>
        )}
      </header>

      {message && <div className={styles.message}>{message}</div>}

      {peneiras.length === 0 ? (
        <div className={styles.feedback}>Nenhuma peneira disponível no momento.</div>
      ) : (
        <div className={styles.cardsContainer}>
          {peneiras.map((p) => (
            <div key={p.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <FaFutbol className={styles.icon} />
                <h3 className={styles.title}>{p.titulo}</h3>
              </div>
              <p className={styles.description}>{p.descricao}</p>
              
              {/* 5. EXIBIÇÃO DOS NOVOS DADOS NO CARD */}
              <div className={styles.info}>
                <span><FaMapMarkerAlt /> {p.local}</span>
                <span><FaMap /> {p.estado}</span> {/* Novo: Estado */}
                <span><FaCalendarAlt /> {new Date(p.data_evento).toLocaleDateString('pt-BR')}</span>
              </div>
              
              <div className={styles.details}>
                <span>
                    <FaUserFriends /> Idade Min: <strong>{p.idade} anos</strong>
                </span>
                {p.posicao && (
                    <span>
                        <FaCrosshairs /> Posição: <strong>{p.posicao}</strong>
                    </span>
                )}
              </div>
              
              <div className={styles.goals}>
                  <p><strong>Objetivo:</strong> {p.objetivo}</p>
              </div>
              {/* FIM DA EXIBIÇÃO DOS NOVOS DADOS */}
              
              {user.role === 'Jogador' && (
                <div className={styles.cardActions}>
                  <button 
                    onClick={() => handleToggleInscricao(p.id)}
                    className={inscricoes.has(p.id) ? styles.subscribedButton : styles.subscribeButton}
                  >
                    <FaUserCheck /> {inscricoes.has(p.id) ? 'Inscrito' : 'Inscrever-se'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>{editingPeneira ? "Editar Peneira" : "Nova Peneira"}</h2>
            
            {/* Campos Antigos */}
            <label>Título *</label>
            <input value={titulo} onChange={(e) => setTitulo(e.target.value)} />
            <label>Descrição *</label>
            <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} />
            <label>Local *</label>
            <input value={local} onChange={(e) => setLocal(e.target.value)} />
            <label>Data e Hora do Evento *</label>
            <input
              type="datetime-local"
              value={dataEvento}
              onChange={(e) => setDataEvento(e.target.value)}
            />

            {/* 6. NOVOS CAMPOS NO MODAL */}
            <label>Estado/UF *</label>
            <input value={estado} onChange={(e) => setEstado(e.target.value)} placeholder="Ex: MG, SP, RJ" />
            
            <label>Idade Mínima Requerida *</label>
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
            
            {/* Ações */}
            <div className={styles.modalActions}>
              <button className={styles.cancelButton} onClick={closeModal}>
                Cancelar
              </button>
              <button className={styles.submitButton} onClick={handleCreate}>
                Criar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PeneirasPage;