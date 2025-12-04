// Footer.tsx
import React from "react";
import styles from "./Footer.module.scss";

export const Footer: React.FC = () => (
  <footer id="Footer" className={styles.footer}>
    <div>Golear © 2025</div>
    <div className={styles.links}>
      <span>Sobre</span>
      <span>Contato</span>
      <span>Termos</span>
      <span>Privacidade</span>
    </div>
  </footer>
);
