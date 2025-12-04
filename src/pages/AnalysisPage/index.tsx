import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from "recharts";
import {
  FaUsers,
  FaRegThumbsUp,
  FaCommentDots,
  FaShareAlt,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import styles from "./AnalysisPage.module.scss";

// ------------------- MOCK DATA -------------------

// Social metrics
const socialStats = [
  { name: "Seguidores", value: 1500, trend: "+12%", icon: <FaUsers /> },
  { name: "Curtidas", value: 1200, trend: "+8%", icon: <FaRegThumbsUp /> },
  { name: "Comentários", value: 400, trend: "-2%", icon: <FaCommentDots /> },
  { name: "Compartilhamentos", value: 250, trend: "+5%", icon: <FaShareAlt /> },
  { name: "Alcance", value: 5000, trend: "+15%", icon: <FaUsers /> },
  { name: "Impressões", value: 12000, trend: "+10%", icon: <FaUsers /> },
];

// Recent visitors
const recentVisitors = [
  { id: 1, name: "Carlos Silva", avatar: "https://randomuser.me/api/portraits/men/32.jpg", lastVisit: "2h atrás" },
  { id: 2, name: "Ana Souza", avatar: "https://randomuser.me/api/portraits/women/44.jpg", lastVisit: "3h atrás" },
  { id: 3, name: "João Oliveira", avatar: "https://randomuser.me/api/portraits/men/12.jpg", lastVisit: "4h atrás" },
  { id: 4, name: "Beatriz Lima", avatar: "https://randomuser.me/api/portraits/women/24.jpg", lastVisit: "5h atrás" },
  { id: 5, name: "Lucas Martins", avatar: "https://randomuser.me/api/portraits/men/55.jpg", lastVisit: "6h atrás" },
];

// Match history - detalhado
const matchHistory = [
  {
    match: "Jogo 1",
    goals: 2,
    assists: 1,
    successfulPasses: 25,
    dribbles: 5,
    shotsOnTarget: 3,
    minutes: 90,
    activity: 8,
    possession: 58,
    keyPasses: 4,
    yellowCards: 0,
    redCards: 0,
    foulsCommitted: 1,
    foulsSuffered: 2,
    avgSpeed: 7.2,
    distance: 9.5,
    rating: 8.5,
  },
  {
    match: "Jogo 2",
    goals: 1,
    assists: 0,
    successfulPasses: 18,
    dribbles: 3,
    shotsOnTarget: 2,
    minutes: 85,
    activity: 7,
    possession: 52,
    keyPasses: 2,
    yellowCards: 1,
    redCards: 0,
    foulsCommitted: 2,
    foulsSuffered: 1,
    avgSpeed: 6.8,
    distance: 8.7,
    rating: 7.3,
  },
  {
    match: "Jogo 3",
    goals: 0,
    assists: 2,
    successfulPasses: 30,
    dribbles: 6,
    shotsOnTarget: 1,
    minutes: 88,
    activity: 9,
    possession: 60,
    keyPasses: 5,
    yellowCards: 0,
    redCards: 0,
    foulsCommitted: 1,
    foulsSuffered: 3,
    avgSpeed: 7.0,
    distance: 9.0,
    rating: 8.0,
  },
  {
    match: "Jogo 4",
    goals: 3,
    assists: 1,
    successfulPasses: 22,
    dribbles: 4,
    shotsOnTarget: 5,
    minutes: 90,
    activity: 10,
    possession: 55,
    keyPasses: 3,
    yellowCards: 0,
    redCards: 0,
    foulsCommitted: 0,
    foulsSuffered: 2,
    avgSpeed: 7.5,
    distance: 10.2,
    rating: 9.0,
  },
  {
    match: "Jogo 5",
    goals: 1,
    assists: 0,
    successfulPasses: 20,
    dribbles: 2,
    shotsOnTarget: 3,
    minutes: 80,
    activity: 6,
    possession: 50,
    keyPasses: 1,
    yellowCards: 0,
    redCards: 0,
    foulsCommitted: 1,
    foulsSuffered: 1,
    avgSpeed: 6.5,
    distance: 8.0,
    rating: 7.0,
  },
];

// Função de média
const avg = (key: string) =>
  (matchHistory.reduce((acc, m) => acc + (m as any)[key], 0) / matchHistory.length).toFixed(2);

// Radar de habilidades completo
const playerPerformance = [
  { skill: "Gols", value: parseFloat(avg("goals")) },
  { skill: "Assistências", value: parseFloat(avg("assists")) },
  { skill: "Passes Certos", value: parseFloat(avg("successfulPasses")) },
  { skill: "Dribles", value: parseFloat(avg("dribbles")) },
  { skill: "Finalizações", value: parseFloat(avg("shotsOnTarget")) },
  { skill: "Posse de Bola", value: parseFloat(avg("possession")) },
  { skill: "Key Passes", value: parseFloat(avg("keyPasses")) },
  { skill: "Atividade", value: parseFloat(avg("activity")) },
  { skill: "Rating", value: parseFloat(avg("rating")) },
];

// Engajamento semanal
const engagementWeek = [
  { day: "Seg", views: 200, likes: 50, comments: 20 },
  { day: "Ter", views: 250, likes: 70, comments: 30 },
  { day: "Qua", views: 300, likes: 100, comments: 45 },
  { day: "Qui", views: 280, likes: 90, comments: 40 },
  { day: "Sex", views: 350, likes: 120, comments: 55 },
  { day: "Sáb", views: 500, likes: 200, comments: 80 },
  { day: "Dom", views: 400, likes: 150, comments: 60 },
];

// Performance por hashtags
const searchPerformance = [
  { term: "Dribles", views: 120 },
  { term: "Finalizações", views: 90 },
  { term: "Assistências", views: 75 },
  { term: "Gols", views: 150 },
];

// Insights
const insights = [
  { title: "Maior número de gols na semana", value: 3, icon: <FaArrowUp />, color: "#4CAF50" },
  { title: "Engajamento médio acima da média", value: "+10%", icon: <FaArrowUp />, color: "#2196F3" },
  { title: "Comentário negativo em post", value: 1, icon: <FaArrowDown />, color: "#F44336" },
];

const ProfileAnalysisPage: React.FC = () => {

  return (
    <div className={styles.dashboard}>
      {/* HEADER */}
      <header className={styles.header}>
        <h1>Analise perfil do usuario</h1>
      </header>

      {/* CARDS DE MÉTRICAS */}
      <section className={styles.overview}>
        {socialStats.map((item, i) => (
          <div key={i} className={styles.card}>
            <div className={styles.icon}>{item.icon}</div>
            <div className={styles.cardContent}>
              <h3>{item.value}</h3>
              <p>{item.name}</p>
              <span className={styles.trend}>{item.trend}</span>
            </div>
          </div>
        ))}
      </section>

      {/* VISITANTES */}
      <section className={styles.visitors}>
        <h2>Últimos Visitantes</h2>
        <div className={styles.visitorGrid}>
          {recentVisitors.map((v) => (
            <div key={v.id} className={styles.visitorCard}>
              <img src={v.avatar} alt={v.name} />
              <div>
                <h4>{v.name}</h4>
                <p>{v.lastVisit}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* GRÁFICOS */}
      <section className={styles.graphRow}>
        <div className={styles.graphCard}>
          <h2>Engajamento Semanal</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={engagementWeek}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="views" stroke="#4CAF50" name="Visualizações" />
              <Line type="monotone" dataKey="likes" stroke="#2196F3" name="Curtidas" />
              <Line type="monotone" dataKey="comments" stroke="#FF9800" name="Comentários" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.graphCard}>
          <h2>Performance por Hashtags</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={searchPerformance}>
              <XAxis dataKey="term" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="views" fill="#FF9800" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className={styles.graphRow}>
        {/* Gols por Partida */}
        <div className={styles.graphCard}>
            <h2>Gols por Partida</h2>
            <ResponsiveContainer width="100%" height={200}>
            <BarChart data={matchHistory}>
                <XAxis dataKey="match" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="goals" fill="#4CAF50" name="Gols" />
            </BarChart>
            </ResponsiveContainer>
        </div>

        {/* Assistências por Partida */}
        <div className={styles.graphCard}>
            <h2>Assistências por Partida</h2>
            <ResponsiveContainer width="100%" height={200}>
            <BarChart data={matchHistory}>
                <XAxis dataKey="match" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="assists" fill="#2196F3" name="Assistências" />
            </BarChart>
            </ResponsiveContainer>
        </div>

        {/* Passes Certos por Partida */}
        <div className={styles.graphCard}>
            <h2>Passes Certos por Partida</h2>
            <ResponsiveContainer width="100%" height={200}>
            <BarChart data={matchHistory}>
                <XAxis dataKey="match" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="successfulPasses" fill="#FF9800" name="Passes Certos" />
            </BarChart>
            </ResponsiveContainer>
        </div>

        {/* Dribles por Partida */}
        <div className={styles.graphCard}>
            <h2>Dribles por Partida</h2>
            <ResponsiveContainer width="100%" height={200}>
            <BarChart data={matchHistory}>
                <XAxis dataKey="match" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="dribbles" fill="#9C27B0" name="Dribles" />
            </BarChart>
            </ResponsiveContainer>
        </div>

        
        {/* Engajamento Social */}
        <div className={styles.graphCard}>
            <h2>Engajamento Social</h2>
            <ResponsiveContainer width="100%" height={300}>
            <BarChart data={socialStats}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#00BCD4" name="Valor" />
            </BarChart>
            </ResponsiveContainer>
        </div>

        {/* Radar de Habilidade */}
        <div className={styles.graphCard}>
            <h2>Radar de Performance do Jogador</h2>
            <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={playerPerformance}>
                <PolarGrid />
                <PolarAngleAxis dataKey="skill" />
                <PolarRadiusAxis />
                <Radar dataKey="value" stroke="#4CAF50" fill="#4CAF50" fillOpacity={0.6} />
                <Tooltip />
            </RadarChart>
            </ResponsiveContainer>
        </div>
        </section>

        


      {/* INSIGHTS */}
      <section className={styles.insights}>
        {insights.map((i, idx) => (
          <div key={idx} className={styles.insightCard} style={{ borderLeft: `4px solid ${i.color}` }}>
            <div className={styles.icon}>{i.icon}</div>
            <div>
              <h4>{i.title}</h4>
              <p>{i.value}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default ProfileAnalysisPage;
