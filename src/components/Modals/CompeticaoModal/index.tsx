import React, { useState, useEffect } from "react";
//import { criarCompeticao } from "../../../services/competicoes";
import type { Competicao } from "../../../types";
import styles from "./CompeticaoModal.module.scss";
import emailjs from "@emailjs/browser";
import { useAuth } from "../../../context/AuthContext";

interface CompeticaoModalProps {
  onClose: () => void;
  onCreated: (competicao: Competicao) => void;
}

const CompeticaoModal: React.FC<CompeticaoModalProps> = ({ onClose, /*onCreated*/ }) => {
  const { user } = useAuth();
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [data_inicio, setDataInicio] = useState("");
  const [data_fim, setDataFim] = useState("");
  const [mensagemFederacao, setMensagemFederacao] = useState("");
  const [nomeClube, setNomeClube] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Preenche automaticamente o nome do clube logado (se disponível)
  useEffect(() => {
    if (user?.nome) {
      setNomeClube(user.nome);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !descricao || !data_inicio || !data_fim) {
      setError("Todos os campos obrigatórios devem ser preenchidos.");
      return;
    }

    setLoading(true);
    try {
      // 1️⃣ Envio ao backend (mantido igual)
      //const payload = { nome, descricao, data_inicio, data_fim };
      //const novaCompeticao = await criarCompeticao(payload);

      // 2️⃣ Envio de e-mail (usando EmailJS)
      const emailParams = {
        nome_clube: nomeClube || "Clube não identificado",
        nome_competicao: nome,
        descricao,
        data_inicio,
        data_fim,
        mensagem_federacao: mensagemFederacao || "Nenhuma mensagem adicional.",
      };

      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID || "",
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "",
        emailParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY || ""
      );

      //onCreated(novaCompeticao);
      onClose();
    } catch (err) {
      console.error("❌ Erro ao criar competição:", err);
      setError("Erro ao criar competição ou enviar e-mail. Verifique os dados e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Criar Competição</h2>
        {error && <p className={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome da Competição"
            required
          />

          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Descrição"
            required
          />

          <label>Data de Início:</label>
          <input
            type="date"
            value={data_inicio}
            onChange={(e) => setDataInicio(e.target.value)}
            required
          />

          <label>Data de Fim:</label>
          <input
            type="date"
            value={data_fim}
            onChange={(e) => setDataFim(e.target.value)}
            required
          />

          <label>Nome do Clube:</label>
          <input
            value={nomeClube}
            onChange={(e) => setNomeClube(e.target.value)}
            placeholder="Nome do Clube"
            readOnly
          />

          <label>Mensagem para a Federação (opcional):</label>
          <textarea
            value={mensagemFederacao}
            onChange={(e) => setMensagemFederacao(e.target.value)}
            placeholder="Mensagem para a Federação"
          />

          <div className={styles.buttons}>
            <button type="submit" disabled={loading}>
              {loading ? "Enviando..." : "Criar Competição"}
            </button>
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompeticaoModal;
