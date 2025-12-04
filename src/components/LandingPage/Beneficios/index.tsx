import React from "react";
import styles from "./Beneficios.module.scss";
// Importei novos ícones para os novos perfis
import { FaUsers, FaFutbol, FaSearch, FaHeart, FaBriefcase } from "react-icons/fa";

export const Beneficios: React.FC = () => {
  return (
    <section id="beneficios" className={styles.beneficios}>
      <h2>Benefícios por Perfil</h2>
      <div className={styles.cards}>

        {/* 1. JOGADORES */}
        <div className={styles.card}>
          <FaFutbol className={styles.icon} />
          <h3>Jogadores</h3>
          <ul>
            <li>Vitrine Completa: Perfil com estatísticas (Velocidade, Força, Técnica) para Society, Campo ou Futsal.</li>
            <li>Exposição a Clubes: Mais visibilidade para Olheiros e Clubes, com base em posição e região.</li>
            <li>Oportunidades: Participação e inscrição facilitada em Peneiras e Competições locais.</li>
            <li>Engajamento: Publique fotos, vídeos e receba feedback da comunidade.</li>
          </ul>
        </div>

        {/* 2. CLUBES */}
        <div className={styles.card}>
          <FaUsers className={styles.icon} />
          <h3>Clubes</h3>
          <ul>
            <li>Recrutamento Eficiente: Encontre talentos filtrando por Posição, Região e Estatísticas.</li>
            <li>Organização de Eventos: Crie, divulgue e gerencie peneiras e competições diretamente no app.</li>
            <li>Visibilidade Institucional: Amplie o alcance do seu clube e atraia novos atletas para suas categorias.</li>
            <li>Networking: Conecte-se com Olheiros e outros Profissionais da área.</li>
          </ul>
        </div>

        {/* 3. OLHEIROS */}
        <div className={styles.card}>
          <FaSearch className={styles.icon} /> {/* Novo Ícone */}
          <h3>Olheiros</h3>
          <ul>
            <li>Radar de Talentos: Pesquise jogadores com filtros avançados de área de atuação e especialização.</li>
            <li>Análise Detalhada: Acesse o perfil completo do atleta com estilo de jogo e referências.</li>
            <li>Experiência Comprovada: Exponha sua experiência e clubes de atuação para aumentar sua credibilidade.</li>
            <li>Mensagens Diretas: Contate jogadores e clubes de forma ágil e profissional.</li>
          </ul>
        </div>

        {/* 4. PROFISSIONAIS (Ex: Treinadores, Agentes, Preparadores) */}
        <div className={styles.card}>
          <FaBriefcase className={styles.icon} /> {/* Novo Ícone */}
          <h3>Profissionais</h3>
          <ul>
            <li>Serviços em Destaque: Exponha sua profissão, região de atuação e experiência para a comunidade.</li>
            <li>Gestão de Atletas: Acompanhe a evolução de seus clientes/atletas através das estatísticas de perfil.</li>
            <li>Networking: Conecte-se com Clubes e Olheiros para novas oportunidades de negócio.</li>
            <li>Marketing Pessoal: Crie publicações e interaja para se posicionar como autoridade na área.</li>
          </ul>
        </div>

        {/* 5. FÃS */}
        <div className={styles.card}>
          <FaHeart className={styles.icon} /> {/* Novo Ícone */}
          <h3>Fãs / Admiradores</h3>
          <ul>
            <li>Comunidade de Futebol: Participe de discussões, comente e curta conteúdos de outros usuários.</li>
            <li>Seus Favoritos: Exiba seu time do coração e jogador favorito no seu perfil.</li>
            <li>Notícias e Interesses: Siga e interaja com seus atletas e clubes preferidos.</li>
            <li>Apoio: Encontre e apoie talentos em ascensão em sua região.</li>
          </ul>
        </div>

      </div>
    </section>
  );
};