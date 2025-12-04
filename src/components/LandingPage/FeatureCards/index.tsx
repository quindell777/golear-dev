// FeatureCards.tsx
import React from "react";
import styles from "./Feature.module.scss";
import { FaUserAlt, FaTrophy, FaHandshake, FaChartLine } from "react-icons/fa";

const features = [
  {
    icon: <FaUserAlt />,
    title: "Perfil de Jogador",
    desc: "Adicione posição, histórico, estatísticas e conquistas.",
  },
  {
    icon: <FaTrophy />,
    title: "Peneiras e Competições",
    desc: "Participe de eventos criados por clubes e treinadores.",
  },
  {
    icon: <FaHandshake />,
    title: "Conexão Profissional",
    desc: "Conecte-se com clubes, olheiros e treinadores.",
  },
  {
    icon: <FaChartLine />,
    title: "Estatísticas Detalhadas",
    desc: "Acompanhe sua performance em cada partida e torneio.",
  },
];

export const FeatureCards: React.FC = () => (
  <section id="Feature" className={styles.features}>
    <h2>Funcionalidades</h2>
    <div className={styles.cards}>
      {features.map((f, i) => (
        <div className={styles.card} key={i}>
          <div className={styles.icon}>{f.icon}</div>
          <h3>{f.title}</h3>
          <p>{f.desc}</p>
        </div>
      ))}
    </div>
  </section>
);
