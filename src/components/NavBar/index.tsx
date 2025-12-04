// NavBar.tsx
import React, { useState, useRef, useEffect } from "react";
// Importe o useNavigate para redirecionar
import { Link, useNavigate } from "react-router-dom"; 
import { IoIosMenu } from "react-icons/io";
import styles from "./NavBar.module.scss";
import logo from "../../assets/LogoGolear-4.png";
import { useAuth } from "../../context/AuthContext";
// Não precisamos mais de searchPlayers ou Player aqui

const Navbar: React.FC = () => {
  const { profile, loadingProfile } = useAuth();
  const navigate = useNavigate(); // Hook para navegar

  const [query, setQuery] = useState<string>(""); // Apenas o query da busca
  const [menuOpen, setMenuOpen] = useState(false);

  // Removemos os states de 'results' e 'searchOpen'
  // Removemos 'timeoutRef' e 'searchRef'

  const menuRef = useRef<HTMLDivElement>(null);

  /**
   * @function handleSearchSubmit
   * @description Chamado ao pressionar Enter na busca. Redireciona para a pág. de resultados.
   */
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Impede o recarregamento da página
    if (query.trim()) {
      // Navega para a página de busca, passando o 'nome' como query param
      navigate(`/search?nome=${query}`);
      setQuery(""); // Opcional: limpa o campo após a busca
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
          // O onChange agora é simples, só atualiza o state
          onChange={(e) => setQuery(e.target.value)} 
          className={styles.search}
        />
        {/* O dropdown de resultados (<ul>) foi removido */}
      </form>

      <div className={styles.userProfile}>
        {loadingProfile ? (
          <span>Carregando...</span>
        ) : profile ? (
          // O ID do perfil vem do AuthContext
          <Link to={`/profile/${profile.id}`} className={styles.profileLink}>
            <span>{profile.nome}</span>
          </Link>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>

      <button
        className={styles.menuButton}
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label="Abrir menu"
      >
        <IoIosMenu size={22} />
      </button>

      {menuOpen && (
        <div className={styles.mobileDropdown} ref={menuRef}>
          <Link to="/feed" onClick={() => setMenuOpen(false)}>Feed</Link>
          
          {/* --- LINKS CONDICIONAIS PELA ROLE (da documentação) --- */}
          {profile?.role === "Jogador" && (
            <Link to="/peneiras" onClick={() => setMenuOpen(false)}>Peneiras</Link>
          )}
          {profile?.role === "Clube" && (
            <Link to="/competicoes" onClick={() => setMenuOpen(false)}>Competições</Link>
          )}
          {profile?.role === "Olheiro" && (
             <Link to="/peneiras" onClick={() => setMenuOpen(false)}>Peneiras</Link>
          )}
          {/* Adicione outros links de role aqui (Fã, Profissional) */}
          
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