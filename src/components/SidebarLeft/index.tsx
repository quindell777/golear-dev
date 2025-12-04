import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaCog, FaCamera } from "react-icons/fa";
import styles from "./SidebarLeft.module.scss";
import { useAuth } from "../../context/AuthContext";
import Settings from "../../pages/Settings";
import { request } from "../../services/api";
import ConnectionsModal from "../ConnectionsModal";
import UpdateProfilePictureModal from "../Modals/UpdateProfilePictureModal";

const DEFAULT_AVATAR =
  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
const DEFAULT_BANNER =
  "https://images.unsplash.com/photo-1503264116251-35a269479413?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTI4MHwwfDF8c2VhfGZ8fHx8fHx8MTY5NzEyNjg1Mw&ixlib=rb-4.0.3&q=80&w=1080";

interface Props {
  openSettings?: () => void;
}

const SidebarLeft: React.FC<Props> = () => {
  const { profile, loadingProfile } = useAuth();

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isPictureModalOpen, setPictureModalOpen] = useState(false); // State for the new modal
  const [counts, setCounts] = useState({ followers: 0, following: 0 });
  const [modalConfig, setModalConfig] = useState<{title: string, endpoint: string} | null>(null);

  useEffect(() => {
    if (profile?.id) {
      const fetchCounts = async () => {
        try {
          const [followersRes, followingRes] = await Promise.all([
            request<{ total: number }>({ url: `/usuarios/${profile.id}/seguidores` }),
            request<{ total: number }>({ url: `/usuarios/${profile.id}/seguindo` })
          ]);
          setCounts({
            followers: followersRes.data.total || 0,
            following: followingRes.data.total || 0
          });
        } catch (error) {
          console.error("Erro ao buscar contagem de conexões:", error);
        }
      };
      fetchCounts();
    }
  }, [profile?.id]);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.profile}>
        {loadingProfile ? (
          <div className={styles.skeleton}>
            <div className={styles.skeletonBanner}></div>
            <div className={styles.skeletonAvatar}></div>
            <div className={styles.skeletonText}></div>
            <div className={styles.skeletonText}></div>
          </div>
        ) : profile ? (
          <>
            <div
              className={styles.cover}
              style={{ backgroundImage: `url(${DEFAULT_BANNER})` }}
            />
            <div className={styles.profileContent}>
              <Link to={`/profile/${profile.id}`}>
                <img
                  src={profile.profilePictureUrl || DEFAULT_AVATAR}
                  alt={profile.nome || "Usuário"}
                  className={styles.avatar}
                />
              </Link>
              <div className={styles.userInfo}>
                <h3>{profile.nome || "Usuário"}</h3>
                <p><strong>{profile.bio}</strong></p>
              </div>
            </div>
            <div className={styles.stats}>
              <div className={styles.stat} onClick={() => setModalConfig({ title: 'Seguidores', endpoint: `/usuarios/${profile.id}/seguidores` })}>
                <strong>{counts.followers}</strong>
                <span>Seguidores</span>
              </div>
              <div className={styles.stat} onClick={() => setModalConfig({ title: 'Seguindo', endpoint: `/usuarios/${profile.id}/seguindo` })}>
                <strong>{counts.following}</strong>
                <span>Seguindo</span>
              </div>
            </div>
          </>
        ) : (
          <p className={styles.errorMessage}>Faça login para ver seu perfil.</p>
        )}
      </div>

      <div className={styles.usefulLinks}>
        <h4>Links úteis</h4>
        <button onClick={() => setPictureModalOpen(true)}>
          <FaCamera /> Alterar Foto de Perfil
        </button>
        <button onClick={() => setSettingsOpen(true)}>
          <FaCog /> Configurações
        </button>
      </div>

      {settingsOpen && <Settings onClose={() => setSettingsOpen(false)} />}
      {modalConfig && <ConnectionsModal {...modalConfig} onClose={() => setModalConfig(null)} />}
      {isPictureModalOpen && <UpdateProfilePictureModal onClose={() => setPictureModalOpen(false)} />}
    </aside>
  );
};

export default SidebarLeft;