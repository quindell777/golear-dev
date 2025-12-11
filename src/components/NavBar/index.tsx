// NavBar.tsx
import React, { useState, useRef, useEffect } from "react";
// Importe o useNavigate para redirecionar
import { Link, useNavigate } from "react-router-dom"; 
import { IoIosMenu } from "react-icons/io";
import styles from "./NavBar.module.scss";
import logo from "../../assets/LogoGolear-4.png";
import { useAuth } from "../../context/AuthContext";

const Navbar: React.FC = () => {
  const { profile, loadingProfile } = useAuth();
  const navigate = useNavigate();

  const [query, setQuery] = useState<string>(""); 
  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  /**
   * @function handleSearchSubmit
   * @description Chamado ao pressionar Enter na busca. Redireciona para a pág. de resultados.
   */
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?nome=${query}`);
      setQuery(""); 
    }
  };

  // Fecha dropdown ao clicar fora (lógica mantida para o menu mobile)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className={styles.navbar}>
      <Link to="/feed" className={styles.logo}>
        <img src={logo} alt="Logo Golear" className={styles.logoImg} />
        <span className={styles.brandName}>Golear</span>
      </Link>

      {/* A div virou um <form> */}
      <form className={styles.searchContainer} onSubmit={handleSearchSubmit}>
        <input
          type="search"
          placeholder="Buscar jogadores"
          value={query}
          onChange={(e) => setQuery(e.target.value)} 
          className={styles.search}
        />
      </form>

      {/* NOVO: Links de navegação para Desktop (Visível > 768px) */}
      <div className={styles.desktopLinks}>
        <Link to="/feed">Feed</Link>
        {profile?.role === "Jogador" && (
          <Link to="/peneiras">Peneiras</Link>
        )}
        {profile?.role === "Clube" && (
          <Link to="/competicoes">Competições</Link>
        )}
        {profile?.role === "Olheiro" && (
            <Link to="/peneiras">Peneiras</Link>
        )}
      </div>

      <div className={styles.userProfile}>
        {loadingProfile ? (
          <span>Carregando...</span>
        ) : profile ? (
          <Link to={`/profile/${profile.id}`} className={styles.profileLink}>
            {/* O SPAN encapsula o nome para aplicar a regra de ellipsis no CSS */}
            <span>{profile.nome}</span> 
          </Link>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>

      {/* O menuButton é escondido no desktop e visível no mobile */}
      <button
        className={styles.menuButton}
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label="Abrir menu"
      >
        <IoIosMenu size={22} />
      </button>

      {/* O mobileDropdown é o menu hambúrguer (Visível no Mobile) */}
      {menuOpen && (
        <div className={styles.mobileDropdown} ref={menuRef}>
          <Link to="/feed" onClick={() => setMenuOpen(false)}>Feed</Link>
          
          {/* --- LINKS CONDICIONAIS PELA ROLE --- */}
          {profile?.role === "Jogador" && (
            <Link to="/peneiras" onClick={() => setMenuOpen(false)}>Peneiras</Link>
          )}
          {profile?.role === "Clube" && (
            <Link to="/competicoes" onClick={() => setMenuOpen(false)}>Competições</Link>
          )}
          {profile?.role === "Olheiro" && (
              <Link to="/peneiras" onClick={() => setMenuOpen(false)}>Peneiras</Link>
          )}
          
          {/* Links de Perfil/Login */}
          {profile ? (
            <Link to={`/profile/${profile.id}`} onClick={() => setMenuOpen(false)}>Perfil</Link>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;