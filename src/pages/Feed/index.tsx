import React, { useEffect, useState } from "react";
import PostCard from "../../components/Post";
import NewPostForm from "../../components/NewPostForm";
import { request } from "../../services/api";
import { deletePost } from "../../services/postService";
import type { Post, PostsResponse } from "../../types";
import styles from "./feed.module.scss";
import { useAuth } from "../../context/AuthContext";

// Para animações
import { CSSTransition, TransitionGroup } from "react-transition-group";

const Feed: React.FC = () => {
  const { profile } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await request<PostsResponse>({ url: "/feed/api", method: "GET" });
      setPosts(res.data.posts || []);
    } catch (err: any) {
      console.error("❌ Erro ao buscar posts:");
      if (err.response) {
        console.error("➡️ Status:", err.response.status);
        console.error("➡️ Data:", err.response.data);
        console.error("➡️ Headers:", err.response.headers);
      } else if (err.request) {
        console.error("➡️ Sem resposta da API. Request:", err.request);
      } else {
        console.error("➡️ Erro na configuração da requisição:", err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleNewPost = (post: Post) => setPosts(prev => [post, ...prev]);

  const handleToggleLike = async (id: number) => {
    const post = posts.find(p => p.id === id);
    if (!post) return;

    const isLiked = post.likedByCurrentUser;

    // A API não documenta um endpoint para descurtir.
    // Apenas a ação de curtir será permitida.
    if (isLiked) {
      alert("A funcionalidade de descurtir ainda não foi implementada.");
      return;
    }

    try {
      // A requisição agora só acontece para curtir (POST)
      await request({
        url: `/posts/${id}/like`,
        method: 'POST',
      });

      setPosts(prev =>
        prev.map(p =>
          p.id === id
            ? {
                ...p,
                likedByCurrentUser: true,
                likes: (p.likes || 0) + 1,
              }
            : p
        )
      );
    } catch (err: any) {
      console.error(`❌ Erro ao curtir o post ID=${id}:`, err);
      if (err.response) {
        // Exibe a mensagem de erro do backend, se disponível (ex: "Você já curtiu este post")
        alert(err.response.data.message || "Não foi possível curtir o post.");
      } else {
        alert("Ocorreu um erro de rede. Tente novamente.");
      }
    }
  };

  const handleDeletePost = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja deletar este post?")) {
      return;
    }

    try {
      await deletePost(id);
      setPosts(prevPosts => prevPosts.filter(p => p.id !== id));
    } catch (err: any) {
      console.error(`❌ Erro ao deletar post ID=${id}:`, err);
      // Exibe a mensagem de erro específica vinda do service
      alert(err.message || "Ocorreu um erro ao deletar o post. Tente novamente.");
    }
  };

  const renderSkeletons = () =>
    Array.from({ length: 3 }).map((_, idx) => (
      <div key={idx} className={styles.noPosts} style={{ minHeight: 100, opacity: 0.5 }}>
        <span className="icon">⏳</span>
        <p>Carregando post...</p>
      </div>
    ));

  return (
    <div className={styles.feed}>
      <NewPostForm onPostCreated={handleNewPost} />
      <div className={styles.postsList}>
        {loading ? (
          renderSkeletons()
        ) : posts.length === 0 ? (
          <div className={styles.noPosts}>
            <span className="icon">📝</span>
            <p>Nenhum post encontrado.</p>
          </div>
        ) : (
          <TransitionGroup>
            {posts.map((p) => (
              <CSSTransition key={p.id} timeout={300} classNames="post">
                <PostCard
                  post={p}
                  onToggleLike={handleToggleLike}
                  onDelete={handleDeletePost}
                  currentUserId={profile?.id}
                />
              </CSSTransition>
            ))}
          </TransitionGroup>
        )}
      </div>
    </div>
  );
};

export default Feed;
