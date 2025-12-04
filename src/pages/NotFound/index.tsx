import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./NotFound.module.scss";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>404</h1>
        <p className={styles.message}>
          Você está fora de jogo! 🚫⚽ <br />
          A página que você procura não existe.
        </p>
        <button onClick={handleGoHome} className={styles.button}>
          Voltar para a Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
