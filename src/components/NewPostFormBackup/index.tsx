// src/components/NewPostForm.tsx
/**
 * @file NewPostForm.tsx
 * @description Componente de formulário para criar um novo post.
 *              Atualiza feed após criação e exibe feedback de carregamento.
 */

import React, { useState } from "react";
import { request } from "../../services/api";
import type { Post } from "../../types";
import styles from "./newPostForm.module.scss";

interface Props {
  onPostCreated: (post: Post) => void;
}

const NewPostForm: React.FC<Props> = ({ onPostCreated }) => {
  /** @state titulo Título do post */
  const [titulo, setTitulo] = useState("");
  /** @state conteudo Conteúdo do post */
  const [conteudo, setConteudo] = useState("");
  /** @state loading Controla estado de envio */
  const [loading, setLoading] = useState(false);

  /** @function handleSubmit Submete novo post para API */
  const handleSubmit = async () => {
    if (!titulo.trim() || !conteudo.trim()) return;
    setLoading(true);

    try {
      const res = await request<{ post: Omit<Post, "likes" | "likedByCurrentUser"> }>({
        url: "/posts",
        method: "POST",
        data: { titulo, conteudo },
      });

      const newPost: Post = {
        ...res.data.post,
        likes: 0,
        likedByCurrentUser: false,
      };

      onPostCreated(newPost); // Notifica Feed
      setTitulo("");
      setConteudo("");
    } catch (err) {
      console.error("Erro ao criar post:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.form}>
      <input
        type="text"
        placeholder="Título do post"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
      />

      <textarea
        placeholder="Escreva algo..."
        value={conteudo}
        onChange={(e) => setConteudo(e.target.value)}
      />

      <div className={styles.actions}>
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Postando..." : "Postar"}
        </button>
      </div>
    </div>
  );
};

export default NewPostForm;
