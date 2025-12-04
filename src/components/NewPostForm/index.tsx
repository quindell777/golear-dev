import React, { useState } from "react";
import { request } from "../../services/api";
import type { Post } from "../../types";
import styles from "./newPostForm.module.scss";

interface Props {
  onPostCreated: (post: Post) => void;
}

const NewPostForm: React.FC<Props> = ({ onPostCreated }) => {
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    const confirmRemove = window.confirm("Tem certeza que deseja remover a imagem?");
    if (confirmRemove) {
      setImage(null);
      setPreview(null);
    }
  };

  const handleSubmit = async () => {
    if (!titulo.trim() || !conteudo.trim()) {
      setError("Preencha todos os campos.");
      return;
    }
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("conteudo", conteudo);
    if (image) formData.append("image", image);

    try {
      const res = await request<{ post: Omit<Post, "likes" | "likedByCurrentUser"> }>({
        url: "/posts",
        method: "POST",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newPost: Post = {
        ...res.data.post,
        likes: 0,
        likedByCurrentUser: false,
      };

      onPostCreated(newPost);
      setTitulo("");
      setConteudo("");
      setImage(null);
      setPreview(null);
    } catch (err) {
      console.error("Erro ao criar post:", err);
      setError("Ocorreu um erro ao postar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="titulo">Título</label>
        <input
          id="titulo"
          type="text"
          placeholder="Título do post"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className={error && !titulo.trim() ? styles.errorInput : ""}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="conteudo">Conteúdo</label>
        <textarea
          id="conteudo"
          placeholder="Escreva algo..."
          value={conteudo}
          onChange={(e) => setConteudo(e.target.value)}
          className={error && !conteudo.trim() ? styles.errorInput : ""}
        />
      </div>

      <div className={styles.buttons}>
        <div className={styles.field}>
          <div className={styles.uploadBox}>
            {!preview && (
              <>
                <input
                  id="image"
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                />
                <label htmlFor="image" className={styles.uploadButton}>
                  Anexar mídia 📎
                </label>
              </>
            )}

            {preview && (
              <>
                <div className={styles.imagePreview}>
                  <img src={preview} alt="Pré-visualização" />
                </div>
                <div className={styles.imageActions}>
                  <label htmlFor="image" className={styles.changeButton}>
                    Mudar imagem
                    <input
                      id="image"
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      hidden
                    />
                  </label>
                  <button
                    type="button"
                    className={styles.removeButton}
                    onClick={handleRemoveImage}
                  >
                    Remover
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <div className={styles.actions}>
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "Postando..." : "Postar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewPostForm;
