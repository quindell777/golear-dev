// src/components/Navbar/Navbar.tsx
import React from "react";
import styles from "./NavBar.module.scss";
import { useNavigate } from "react-router-dom"; // Hook para navegação programática
import logo from "../../../assets/LogoGolear-4.png";

/**
 * Navbar
 *
 * @description Componente de navegação principal da landing page,
 * contendo o logo, links âncora para seções da página e botões
 * para cadastro e login.
 */
export const Navbar: React.FC = () => {
  const navigate = useNavigate(); // Hook do React Router para redirecionar programaticamente

  return (
    <nav className={styles.navbar}>
      {/* Logo + Nome do projeto */}
      <div className={styles.logo}>
        {/* Efeito de zoom é aplicado via CSS */}
        <img src={logo} alt="Logo da Golear" className={styles.logoImg} />
        <h1>GOLEAR</h1>
      </div>

      {/* Links de navegação âncora */}
      <ul className={styles.links}>
        <li><a href="#Feature">Funcionalidades</a></li>
        <li><a href="#Works">Como Funciona</a></li>
      </ul>

      {/* CTA: Ações principais */}
      <div className={styles.cta}>
        <button
          className={styles.signup}
          onClick={() => navigate("/register")}
        >
          Cadastre-se
        </button>
        <button
          className={styles.login}
          onClick={() => navigate("/login")}
        >
          Entrar
        </button>
      </div>
    </nav>
  );
};
