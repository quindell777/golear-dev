import React from "react";
import styles from "./Module.module.scss";

// Props comuns para todos os módulos
interface ModuleProps {
  title: string;
  children: React.ReactNode;
}

const Module: React.FC<ModuleProps> = ({ title, children }) => (
  <div className={styles.module}>
    <h3>{title}</h3>
    <div className={styles.content}>{children}</div>
  </div>
);

export default Module;
