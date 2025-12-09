/**
 * @file ProfilePage.tsx
 * @description
 * Página de perfil do usuário.
 * - Exibe informações do usuário (nome, email, role, histórico de clubes).
 * - Integra com `profileService` para buscar perfil e atualizar dados.
 * - Permite abrir modal de edição (`EditModal`) para alterar dados do perfil.
 * - Mostra sidebar lateral (`FollowersSidebar`) com seguidores do usuário.
 */

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// Componentes usados na página
import ProfileHeader from "../../components/ProfileHeader";
import FollowersSidebar from "../../components/FollowersSidebar";
import EditModal from "../../components/Modals/EditModal";
import Navbar from "../../components/NavBar";

// Serviço de perfil e tipagem
import { getProfileById, updateProfile, getConnectionStatus, connectUser, disconnectUser } from "../../services/profileService";
import type { Profile } from "../../types";

// Contexto de autenticação
import { useAuth } from "../../context/AuthContext";

// Estilos específicos da página
import styles from "./ProfilePage.module.scss";
import UserRecommendations from "../../components/UserRecommendations";

const ProfilePage: React.FC = () => {
  // Obter o perfil COMPLETO do usuário logado através do contexto
  const { user, profile: loggedInProfile } = useAuth();

  /**
   * Captura o parâmetro `id` da URL.
   */
  const { id } = useParams<{ id: string }>();

  /**
   * Armazena os dados completos do perfil do usuário exibido.
   */
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);

  /**
   * Controla se a página está carregando dados.
   */
  const [loading, setLoading] = useState(true);

  /**
   * Controla a visibilidade do modal de edição de perfil.
   */
  const [showModal, setShowModal] = useState(false);

  /**
   * Mantém os dados temporários que o usuário está editando no modal.
   */
  const [editData, setEditData] = useState<Partial<Profile>>({});

  /**
   * Executa a busca do perfil usando o ID da URL.
   */
  useEffect(() => {
    const loadProfile = async () => {
      if (!id) return;
      setLoading(true); // Inicia loading

      try {
        const data = await getProfileById(id);
        setProfile(data); // Atualiza estado com dados do backend

        // Se não for o perfil do próprio usuário, verificar status de conexão
        if (user && user.id !== data.id) {
          const followingStatus = await getConnectionStatus(id);
          setIsFollowing(followingStatus);
          console.log(profile?.role);
        }

      } catch (error) {
        console.error("❌ Erro ao carregar perfil:", error);
        setProfile(null); // Em caso de erro, limpa o perfil
      } finally {
        setLoading(false); // Finaliza loading
      }
    };

    loadProfile();
  }, [id, user]);

  /**
   * Abre o modal de edição e inicializa `editData` com os dados atuais do perfil.
   */
  const handleOpenModal = () => {
    if (profile) setEditData(profile); // Carrega dados do perfil para edição
    setShowModal(true); // Exibe modal
  };

  /**
   * Fecha o modal sem salvar alterações.
   */
  const handleCancel = () => setShowModal(false);

  /**
   * Envia os dados editados para o backend e atualiza o estado do perfil na tela.
   */
  const handleSave = async () => {
    if (!editData || !id) return; // Se não houver dados, não faz nada

    try {
      await updateProfile(editData); // Atualiza no backend
      // Optimistic update
      setProfile(prev => ({ ...prev, ...editData } as Profile));
      setShowModal(false); // Fecha modal

      // Refetch in background to sync with server state
      const updatedProfile = await getProfileById(id);
      setProfile(updatedProfile);
    } catch (error) {
      console.error("❌ Erro ao salvar perfil:", error);
      alert("Falha ao atualizar perfil. Tente novamente.");
    }
  };

  const handleConnect = async () => {
    if (!id) return;
    try {
      await connectUser(id);
      setIsFollowing(true);
    } catch (error: any) {
      console.error("Erro ao conectar com usuário:", error);
      alert(error.message || "Ocorreu um erro ao conectar com o usuário.");
    }
  };

  const handleDisconnect = async () => {
    if (!id) return;
    try {
      await disconnectUser(id);
      setIsFollowing(false);
    } catch (error: any) {
      console.error("Erro ao desconectar do usuário:", error);
      alert(error.message || "Ocorreu um erro ao desconectar do usuário.");
    }
  };

  // Renderização condicional durante carregamento
  if (loading) return <p>Carregando perfil...</p>;

  // Renderização condicional caso não haja perfil
  if (!profile) return <p>Perfil não encontrado.</p>;

  // Lógica de controle do botão: o email do perfil exibido deve ser igual ao email do perfil logado
  const isOwnProfile = loggedInProfile && profile.email === loggedInProfile.email;

  return (
    <>
      <Navbar />

      <div className={styles.profilePage}>
        {/* Conteúdo principal do perfil */}
        <main className={styles.mainContent}>
          {/* Cabeçalho do perfil com Foto, Banner, Nome, Bio e Bloco Visual (Gráfico/Info Condicional) */}
          <ProfileHeader profile={profile} role={profile.role} />

          {/* Seções de Informações Detalhadas */}
          <div className={styles.sections}>
            
            {/* ---------------------------------------------------- */}
            {/* 🟢 SEÇÃO 1: AÇÕES E CONTATO (Comum a todos os Roles) */}
            {/* ---------------------------------------------------- */}
            <div className={styles.module}>
              <h2>Ações e Contato</h2>
              <p>Email: {profile.email}</p>

              {/* WHATSAPP como link para wa.me */}
              {profile.whatsapp && (
                <p>
                  WhatsApp:{" "}
                  <a
                    href={`https://wa.me/${profile.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {profile.whatsapp}
                  </a>
                </p>
              )}

              {/* INSTAGRAM como link para perfil */}
              {profile.instagram && (
                <p>
                  Instagram:{" "}
                  <a
                    href={`https://www.instagram.com/${profile.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    @{profile.instagram}
                  </a>
                </p>
              )}

              {/* X (TWITTER) como link para perfil */}
              {profile.twitter && (
                <p>
                  X (Twitter):{" "}
                  <a
                    href={`https://twitter.com/${profile.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    @{profile.twitter}
                  </a>
                </p>
              )}
              
              <div style={{ marginTop: '1rem' }}>
                {/* Botão de Edição / Conexão */}
                {isOwnProfile ? (
                  <button onClick={handleOpenModal} className={styles.editButton}>
                    Editar Perfil
                  </button>
                ) : (
                  isFollowing ? (
                    <button onClick={handleDisconnect} className={styles.editButton}>
                      Desconectar
                    </button>
                  ) : (
                    <button onClick={handleConnect} className={styles.editButton}>
                      Conectar
                    </button>
                  )
                )}
              </div>
            </div>

            {/* ---------------------------------------------------- */}
            {/* ⚽ SEÇÕES ESPECÍFICAS DE JOGADOR */}
            {/* ---------------------------------------------------- */}
            {profile.role === "Jogador" && (
              <>
                {/* Módulo A: Detalhes Físicos e Posição */}
                <div className={styles.module}>
                  <h2>Características e Posição</h2>
                  {profile.idade && <p>Idade: {profile.idade} anos</p>}
                  {profile.peso && <p>Peso: {profile.peso} kg</p>}
                  {profile.altura && <p>Altura: {profile.altura} cm</p>}
                  
                  <h3 style={{ marginTop: '1rem' }}>Posicionamento</h3>
                  {profile.posicao && <p>Posição principal: {profile.posicao}</p>}
                  {profile.posicaoSecundaria && <p>Posição secundária: {profile.posicaoSecundaria}</p>}
                  {profile.areaAtuacao && <p>Área de Atuação: {profile.areaAtuacao}</p>}

                  {profile.atuacao && (
                    <div>
                      <h3 style={{ marginTop: '1rem' }}>Atuação</h3>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {(() => {
                          try {
                            const atuacaoArray = JSON.parse(profile.atuacao);
                            if (Array.isArray(atuacaoArray)) {
                              return atuacaoArray.map((item: string) => (
                                <span key={item} className={styles.atuacaoTag}>
                                  {item}
                                </span>
                              ));
                            }
                          } catch (error) {
                            console.error("Failed to parse atuacao:", error);
                            return null;
                          }
                        })()}
                      </div>
                    </div>
                  )}
                </div>

                {/* Módulo B: Estilo de Jogo e Especialização */}
                <div className={styles.module}>
                  <h2>Estilo de Jogo</h2>
                  {profile.dominantFoot && <p>Pé dominante: {profile.dominantFoot}</p>}
                  {profile.estiloJogo && <p>Estilo de Jogo: {profile.estiloJogo}</p>}
                  {profile.especializacao && <p>Especialização: {profile.especializacao}</p>}
                  {profile.referencia && <p>Referência: {profile.referencia}</p>}
                </div>

                {/* Módulo C: Histórico Profissional */}
                <div className={styles.module}>
                  <h2>Histórico de Clubes</h2>
                  <p>
                    {profile.historicoClubes || "Nenhum histórico profissional disponível."}
                  </p>
                </div>
              </>
            )}

            {/* ---------------------------------------------------- */}
            {/* 🏟️ SEÇÕES ESPECÍFICAS DE CLUBE */}
            {/* ---------------------------------------------------- */}
            {profile.role === "Clube" && (
              <div className={styles.module}>
                <h2>Detalhes de Atuação</h2>
                {profile.posicaoProcurada && <p>Posição procurada: {profile.posicaoProcurada}</p>}
                
                <h3 style={{ marginTop: '1rem' }}>Estrutura e Competições</h3>
                {profile.categoriaClube && <p>Categoria: {profile.categoriaClube}</p>}
                {profile.divisao && <p>Divisão em que atua: {profile.divisao}</p>}
                {profile.competicoesParticipa && <p>Competições: {profile.competicoesParticipa}</p>}
                {profile.titulos && <p>Títulos conquistados: {profile.titulos}</p>}
              </div>
            )}
            
            {/* ---------------------------------------------------- */}
            {/* 🔎 SEÇÕES ESPECÍFICAS DE OLHEIRO */}
            {/* ---------------------------------------------------- */}
            {profile.role === "Olheiro" && (
              <div className={styles.module}>
                <h2>Detalhes de Atuação</h2>
                {profile.regiao && <p>Região de Atuação: {profile.regiao}</p>}
                {profile.especializacao && <p>Especialização: {profile.especializacao}</p>}
                {profile.clubeOlheiro && <p>Clube em que trabalha: {profile.clubeOlheiro}</p>}
                {profile.nivelAtuacaoOlheiro && <p>Nível de Atuação: {profile.nivelAtuacaoOlheiro}</p>}
              </div>
            )}
            
            {/* ---------------------------------------------------- */}
            {/* 📣 SEÇÕES ESPECÍFICAS DE FÃ */}
            {/* ---------------------------------------------------- */}
            {profile.role === "Fã" && (
              <div className={styles.module}>
                <h2>Preferências Esportivas</h2>
                {profile.time_coracao && <p>Time do Coração: {profile.time_coracao}</p>}
                {profile.jogador_favorito && <p>Jogador favorito: {profile.jogador_favorito}</p>}
                {profile.especializacao && <p>Interesses: {profile.especializacao}</p>}

                {/* WHATSAPP como link para wa.me */}
                {profile.whatsapp && (
                  <p>
                    WhatsApp:{" "}
                    <a
                      href={`https://wa.me/${profile.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {profile.whatsapp}
                    </a>
                  </p>
                )}

                {/* INSTAGRAM como link para perfil */}
                {profile.instagram && (
                  <p>
                    Instagram:{" "}
                    <a
                      href={`https://www.instagram.com/${profile.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      @{profile.instagram}
                    </a>
                  </p>
                )}

                {/* X (TWITTER) como link para perfil */}
                {profile.twitter && (
                  <p>
                    X (Twitter):{" "}
                    <a
                      href={`https://twitter.com/${profile.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      @{profile.twitter}
                    </a>
                  </p>
                )}
              </div>
            )}

            {profile.role === "Profissional" && (
              <div className={styles.module}>
                <h2>Detalhes Profissionais</h2>
                {profile.especializacao && <p>Categoria: **{profile.especializacao}**</p>}
                
                {/* WHATSAPP como link para wa.me */}
                {profile.whatsapp && (
                  <p>
                    WhatsApp:{" "}
                    <a
                      href={`https://wa.me/${profile.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {profile.whatsapp}
                    </a>
                  </p>
                )}

                {/* INSTAGRAM como link para perfil */}
                {profile.instagram && (
                  <p>
                    Instagram:{" "}
                    <a
                      href={`https://www.instagram.com/${profile.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      @{profile.instagram}
                    </a>
                  </p>
                )}

                {/* X (TWITTER) como link para perfil */}
                {profile.twitter && (
                  <p>
                    X (Twitter):{" "}
                    <a
                      href={`https://twitter.com/${profile.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      @{profile.twitter}
                    </a>
                  </p>
                )}
              </div>
            )}
            
            {/* ---------------------------------------------------- */}
            {/* 🔎 SEÇÕES ESPECÍFICAS DE OLHEIRO */}
            {/* ---------------------------------------------------- */}
            
          </div>
        </main>

        {/* Sidebar lateral direita com seguidores */}
        <aside className={styles.sidebarRight}>
          <FollowersSidebar userId={profile.id} />
          <UserRecommendations />
        </aside>

        {/* Modal de edição de perfil */}
        {showModal && (
          <EditModal
            editData={editData}
            setEditData={setEditData}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}
      </div>
    </>
  );
};

export default ProfilePage;
