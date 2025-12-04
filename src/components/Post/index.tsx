import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart, FaComment, FaTrash } from "react-icons/fa";
import type { Post as PostType, Comment } from "../../types";
import { request } from "../../services/api";
import styles from "./Post.module.scss";

interface Props {
  post: PostType;
  onToggleLike: (id: number) => void;
  onDelete: (id: number) => void;
  currentUserId: number | undefined;
}

const PostCard: React.FC<Props> = ({ post, onToggleLike, onDelete, currentUserId }) => {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentCount, setCommentCount] = useState<number>(0);

  // ✅ URL correta baseada no seu backend: /posts/:id/comentarios
  const commentsApiUrl = `/posts/${post.id}/comentarios`;

  // 🔹 Busca apenas o número de comentários quando o post for carregado
  const fetchCommentCount = async () => {
    try {
      const res = await request<{ comentarios: Comment[] }>({
        url: commentsApiUrl, // ✅ Usa a rota correta
        method: "GET",
      });
      const comentarios = res.data.comentarios || [];
      setCommentCount(comentarios.length);
    } catch (error) {
      console.error(`Erro ao contar comentários do post ${post.id}:`, error);
    }
  };

  // 🔹 Busca o conteúdo completo dos comentários (só quando abre)
  const fetchComments = async () => {
    if (comments.length > 0 || commentsLoading) return;
    setCommentsLoading(true);
    try {
      const res = await request<{ comentarios: Comment[] }>({
        url: commentsApiUrl, // ✅ Usa a rota correta
        method: "GET",
      });
      // Se necessário, inverta a ordem aqui ou confie no ORDER BY do backend
      setComments(res.data.comentarios || []);
    } catch (error) {
      console.error("Erro ao buscar comentários:", error);
    } finally {
      setCommentsLoading(false);
    }
  };

  // 🔹 Alterna exibição dos comentários
  const handleToggleComments = () => {
    const newShowState = !showComments;
    setShowComments(newShowState);
    if (newShowState) fetchComments();
  };

  // 🔹 Adiciona comentário e atualiza contador
  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    try {
      const res = await request<{ comentario: Comment }>({
        url: commentsApiUrl, // ✅ Usa a rota correta (POST /posts/:id/comentarios)
        method: "POST",
        data: { texto: commentText }, // ✅ Envia apenas o texto, o ID vem da URL
      });
      
      // Adiciona o novo comentário retornado no topo da lista
      setComments((prev) => [res.data.comentario, ...prev]);
      setCommentText("");
      setCommentCount((prev) => prev + 1);
    } catch (err) {
      console.error(`Erro ao adicionar comentário no post ID=${post.id}:`, err);
    }
  };

  // 🔹 Assim que o post renderiza, conta os comentários
  useEffect(() => {
    fetchCommentCount();
  }, [post.id]);

  return (
    <article className={styles.post}>
      <header className={styles.header}>
        <div className={styles.authorInfo}>
          <Link to = {`/profile/${post.usuarioId}`}>
            <img
              src={
                post.author?.profilePictureUrl ||
                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }
              alt={post.author?.name || "Autor"}
              className={styles.authorAvatar}
            />
          </Link>
          <div>
            <Link to = {`/profile/${post.usuarioId}`}>
              <strong>{post.author?.name || "Usuário Anônimo"}</strong>
            </Link>
            <span className={styles.postTitle}>{post.titulo}</span>
          </div>
        </div>
        {post.usuarioId === currentUserId && (
          <button onClick={() => onDelete(post.id)} className={styles.deleteButton} aria-label="Deletar post">
            <FaTrash />
          </button>
        )}
      </header>

      <p className={styles.content}>{post.conteudo}</p>

      {post.imageUrl && (
        <div className={styles.imageContainer}>
          {post.mediaType === "video" ? (
            <video src={post.imageUrl} controls className={styles.postImage} />
          ) : (
            <img src={post.imageUrl} alt={`Mídia para ${post.titulo}`} className={styles.postImage} />
          )}
        </div>
      )}

      <footer className={styles.footer}>
        <button
          type="button"
          onClick={() => onToggleLike(post.id)}
          aria-label={post.likedByCurrentUser ? "Descurtir" : "Curtir"}
        >
          {post.likedByCurrentUser ? <FaHeart color="#22c55e" /> : <FaRegHeart />}
          <span>{post.likes ?? 0}</span>
        </button>

        <button
          type="button"
          onClick={handleToggleComments}
          aria-label="Comentários"
        >
          <FaComment />
          <span>{commentCount}</span>
        </button>
      </footer>

      {showComments && (
        <div className={styles.commentsSection}>
          {commentsLoading ? (
            <p>Carregando comentários...</p>
          ) : (
            <ul>
              {comments.map((c) => (
                <li key={c.id} className={styles.commentItem}>
                  <img
                    src={
                      c.autor.profilePictureUrl ||
                      "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                    }
                    alt={c.autor.nome}
                    className={styles.commentAvatar}
                  />
                  <div className={styles.commentContent}>
                    <Link to={`/profile/${c.autor.id}`}>
                      <strong>{c.autor.nome}</strong>
                    </Link>
                    <p>{c.texto}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className={styles.commentInput}>
            <input
              type="text"
              placeholder="Escreva um comentário..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
            />
            <button onClick={handleAddComment} type="button">Enviar</button>
          </div>
        </div>
      )}
    </article>
  );
};

export default PostCard;