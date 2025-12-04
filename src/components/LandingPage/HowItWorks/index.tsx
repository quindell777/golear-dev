// HowItWorks.tsx
import React from "react";
import styles from "./HowItWorks.module.scss";

const steps = [
  { title: "Crie seu perfil", desc: "Adicione posição, histórico e estatísticas." },
  { title: "Compartilhe conquistas", desc: "Mostre seu desempenho em partidas e torneios." },
  { title: "Participe de peneiras", desc: "Clubs e treinadores podem avaliar você." },
  { title: "Conecte-se", desc: "Networking com clubes, olheiros e treinadores." },
];

export const HowItWorks: React.FC = () => (
  <section id="Works" className={styles.how}>
    <h2>Como Funciona</h2>
    <div className={styles.steps}>
      {steps.map((s, i) => (
        <div className={styles.step} key={i}>
          <div className={styles.number}>{i + 1}</div>
          <h3>{s.title}</h3>
          <p>{s.desc}</p>
        </div>
      ))}
    </div>
  </section>
);
