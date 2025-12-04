import React from "react";
import type { Competicao } from "../../types";
import { FaFutbol, FaCalendarAlt } from "react-icons/fa";
// import { inscreverUsuario, cancelarInscricao, deletarCompeticao } from "../../services/competicoes";
import styles from "./CompeticaoCard.module.scss";

interface CompeticaoCardProps {
  competicao: Competicao;
}

const CompeticaoCard: React.FC<CompeticaoCardProps> = ({ competicao }) => {
  // const [loadingAction, setLoadingAction] = useState("");
  // const [message, setMessage] = useState("");

  // const handleInscrever = async () => {
  //   setLoadingAction("inscrever");
  //   try {
  //     await inscreverUsuario(competicao.id, usuarioId);
  //     setMessage("Inscrição realizada!");
  //   } catch {
  //     setMessage("Erro ao se inscrever.");
  //   } finally {
  //     setLoadingAction("");
  //   }
  // };

  // const handleCancelar = async () => {
  //   setLoadingAction("cancelar");
  //   try {
  //     await cancelarInscricao(competicao.id, usuarioId);
  //     setMessage("Inscrição cancelada.");
  //   } catch {
  //     setMessage("Erro ao cancelar inscrição.");
  //   } finally {
  //     setLoadingAction("");
  //   }
  // };

  // const handleDeletar = async () => {
  //   setLoadingAction("deletar");
  //   try {
  //     await deletarCompeticao(competicao.id);
  //     onDeleted(competicao.id);
  //   } catch {
  //     setMessage("Erro ao deletar competição.");
  //   } finally {
  //     setLoadingAction("");
  //   }
  // };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <FaFutbol /> <h3>{competicao.nome}</h3>
      </div>
      <div className={styles.info}>
        <p>{competicao.descricao}</p>
        <span><FaCalendarAlt /> Início: {new Date(competicao.data_inicio).toLocaleDateString()}</span>
        <span><FaCalendarAlt /> Fim: {new Date(competicao.data_fim).toLocaleDateString()}</span>
      </div>
      {/* {message && <p className={styles.cardMessage}>{message}</p>} */}
      {/* <div className={styles.actions}>
        {usuarioId !== competicao.id && (
          <>
            <button onClick={handleInscrever} disabled={loadingAction === "inscrever"}>
              <FaUserPlus /> {loadingAction === "inscrever" ? "Inscrevendo..." : "Inscrever"}
            </button>
            <button onClick={handleCancelar} disabled={loadingAction === "cancelar"}>
              <FaUserMinus /> {loadingAction === "cancelar" ? "Cancelando..." : "Cancelar"}
            </button>
          </>
        )}
        {usuarioId === competicao.id && (
          <button onClick={handleDeletar} disabled={loadingAction === "deletar"}>
            <FaTrash /> {loadingAction === "deletar" ? "Deletando..." : "Deletar"}
          </button>
        )}
      </div> */}
    </div>
  );
};

export default CompeticaoCard;