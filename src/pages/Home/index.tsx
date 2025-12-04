// src/pages/Home.tsx
import React from "react";
// Importa a Navbar
import Navbar from "../../components/NavBar";
// Importa sidebar esquerda
import SidebarLeft from "../../components/SidebarLeft";
// Importa sidebar direita
import SidebarRight from "../../components/SidebarRight";
// Importa o feed central
import Feed from "../Feed";
// Importa estilos do módulo
import styles from "./Home.module.scss";

// Interface de props do componente Home
interface HomeProps {
  openSettings: () => void; // função para abrir as configurações
}

// Componente principal Home
const Home: React.FC<HomeProps> = ({ openSettings }) => {
  return (
    <>
      {/* Navbar superior */}
      <Navbar />
      <div className={styles.container}>
        {/* Sidebar esquerda com perfil e links */}
        <SidebarLeft openSettings={openSettings} />
        {/* Feed central */}
        <Feed />
        {/* Sidebar direita com notícias */}
        <SidebarRight />
      </div>
    </>
  );
};

export default Home;
