// src/components/ProfileHeader/ProfileHeader.tsx

import React from "react";
import type { Profile } from "../../types";
import styles from "./ProfileHeader.module.scss";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import banner from "../../assets/jogadores-dentro-celular.png";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface ProfileHeaderProps {
  profile: Profile;
  role: "Jogador" | "Clube" | "Olheiro" | "Fã" | "Profissional";
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile, role }) => {
  // MANTIDO: Dados do Radar
  const radarData = {
    labels: ["Velocidade", "Força", "Técnica", "Passe", "Defesa", "Finalização"],
    datasets: [
      {
        label: `${profile.nome} Skills`,
        data: profile.estatisticas || [0, 0, 0, 0, 0, 0],
        backgroundColor: "rgba(34, 197, 94, 0.2)",
        borderColor: "rgba(34, 197, 94, 1)",
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className={styles.container}>
      {/* -----------------------
          Coluna esquerda: avatar, banner e info básica
          ----------------------- */}
      <div className={styles.leftColumn}>
        <div className={styles.bannerWrapper}>
          {profile.banner ? (
            <img src={profile.banner} alt="Banner" className={styles.bannerImg} />
          ) : (
            <div className={styles.bannerFallback}>
            <img src={banner} className={styles.defaultBanner}/>
            </div>
          )}
        </div>

        <div className={styles.userInfo}>
          <div className={styles.avatarWrapper}>
            {profile.profilePictureUrl ? (
              <img src={profile.profilePictureUrl} alt="Avatar" className={styles.avatarImg} />
            ) : (
              <div className={styles.avatarFallback}></div>
            )}
          </div>

          <div className={styles.basicInfo}>
            <span className={styles.userName}>{profile.nome}</span>
            {profile.bio && <p className={styles.bio}>{profile.bio}</p>}
            {profile.cidade && <p>Cidade: {profile.cidade}</p>}
            
          </div>
        </div>
      </div>

      {/* -----------------------
          Coluna direita: gráficos / info visual condicional (MANTIDA)
          ----------------------- */}
      <div className={styles.rightColumn}>
        {/* Jogador → radar + estatísticas adicionais */}
        {role === "Jogador" && (
          <>
            <div className={styles.radarWrapper}>
              <h3 className={styles.radarTitle}>Habilidades</h3>
              <Radar data={radarData} />
            </div>
            {/* <div className={styles.playerStats}>...</div> */}
          </>
        )}

        {/* Clube → informações básicas do clube (MANTIDO) */}
        {role === "Clube" && (
          <div className={styles.clubInfo}>
            <h3 className={styles.sectionTitle}>Informações do Clube</h3>
            <p>Email: {profile.email}</p>
            {profile.cidade && <p>Cidade: {profile.cidade}</p>}
            {profile.regiao && <p>Região: {profile.regiao}</p>}
          </div>
        )}

        {/* Olheiro → dados disponíveis (MANTIDO) */}
        {role === "Olheiro" && (
          <div className={styles.scoutInfo}>
            <h3 className={styles.sectionTitle}>Informações do Olheiro</h3>
            <p>Email: {profile.email}</p>
            {profile.regiao && <p>Região: {profile.regiao}</p>}
            {profile.cidade && <p>Cidade: {profile.cidade}</p>}
          </div>
        )}

        {/* Fã e Profissional (MANTIDO) */}
        {(role === "Fã" || role === "Profissional") && (
            <div className={styles.scoutInfo}>
                <h3 className={styles.sectionTitle}>Informações</h3>
                <p>Email: {profile.email}</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;