// Hero.tsx
import React from "react";
import styles from "./Hero.module.scss";
import { useNavigate } from "react-router-dom";
import imagemBanner from "../../../assets/jogadores-dentro-celular.png"

export const Hero: React.FC = () => {
  const navigate = useNavigate();
  return (
    <section id="Hero" className={styles.hero}>
      <section className={styles.content}>
        <section className={styles.contentText}>
          <h1><strong>Conectando jogadores</strong>, clubes e treinadores em um só lugar</h1>
          <p>Crie seu perfil, participe de peneiras, torneios e mostre seu talento.</p>
          <section className={styles.buttons}>
            <button className={styles.signup} onClick={() => navigate("/register")}>
              Crie seu Perfil
            </button>
          </section>
        </section>
        <img src={imagemBanner} alt="Uma imagem com dois jogadores saindo da tela de um celular." className={styles.contentBanner}/>
      </section>
      
    </section>
  );
};
