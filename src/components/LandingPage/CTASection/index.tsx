// CTASection.tsx
import React from "react";
import styles from "./CTASection.module.scss";
import { useNavigate } from "react-router-dom";

export const CTASection: React.FC = () => {
  const navigate = useNavigate();
  return (
    <section id="CTA" className={styles.cta}>
      {/* SVG Wave no topo com ondulações suaves */}
      <svg
        className={styles.wave}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          fill="#ffffff" // cor verde predominante
          d="M0,40 C360,0 1080,80 1440,40 L1440,0 L0,0 Z"
        />
      </svg>

      <h2>Seu futuro no futebol começa aqui!</h2>
      <button onClick={() => navigate("/register")}>
        Crie seu perfil grátis hoje
      </button>
    </section>
  );
};
