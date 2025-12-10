import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FaUsers, FaCrosshairs, FaBuilding, FaUserSecret } from "react-icons/fa";
import { searchUsers } from '../../services/searchService';
import type { Profile } from '../../types';
import styles from './SearchPage.module.scss';
import NavBar from '../../components/NavBar';

const UserCard: React.FC<{ user: Profile }> = ({ user }) => {
  const profileId = user.UserId || user.id;

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Jogador': return <FaCrosshairs />;
      case 'Clube': return <FaBuilding />;
      case 'Olheiro': return <FaUserSecret />;
      default: return <FaUsers />;
    }
  };

  return (
    <div className={styles.playerCard}>
      <img src={user.profilePictureUrl} alt={user.nome} className={styles.avatar} />
      
      <div className={styles.details}>
        <p className={styles.name}>{user.nome}</p>
        <div className={styles.info}>
          {getRoleIcon(user.role)} <span>{user.role}</span>
        </div>
        {user.role === 'Jogador' && user.posicao && (
          <div className={styles.info}>
            <span>{user.posicao}</span>
          </div>
        )}
        {user.role === 'Clube' && user.cidade && (
          <div className={styles.info}>
            <span>{user.cidade}</span>
          </div>
        )}
      </div>

      <Link to={`/profile/${profileId}`} className={styles.profileLink}>
        Ver Perfil
      </Link>
    </div>
  );
};

const ROLES = ["", "Jogador", "Clube", "Olheiro", "Fã", "Profissional"];
const POSICOES = ["", "Goleiro", "Zagueiro", "Lateral Direito", "Lateral Esquerdo", "Meio-campista", "Atacante", "Ponta", "Volante"];
const MODALIDADES = ["", "Futebol de Campo", "Futsal", "Futebol Society", "Beach Soccer"];

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    nome: searchParams.get('nome') || '',
    role: searchParams.get('role') || '',
    posicao: searchParams.get('posicao') || '',
    modalidade: searchParams.get('modalidade') || '',
    cidade: searchParams.get('cidade') || '',
    regiao: searchParams.get('regiao') || '',
    especializacao: searchParams.get('especializacao') || '',
    clubeOlheiro: searchParams.get('clubeOlheiro') || '',
    nivelAtuacaoOlheiro: searchParams.get('nivelAtuacaoOlheiro') || '',
  });
  
  const [results, setResults] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const allFilters = {
      nome: searchParams.get('nome') || '',
      role: searchParams.get('role') || '',
      posicao: searchParams.get('posicao') || '',
      modalidade: searchParams.get('modalidade') || '',
      cidade: searchParams.get('cidade') || '',
      regiao: searchParams.get('regiao') || '',
      especializacao: searchParams.get('especializacao') || '',
      clubeOlheiro: searchParams.get('clubeOlheiro') || '',
      nivelAtuacaoOlheiro: searchParams.get('nivelAtuacaoOlheiro') || '',
    };
    setFilters(allFilters);

    const fetchData = async () => {
      setLoading(true);
      const cleanFilters = Object.fromEntries(
        Object.entries(allFilters).filter(([, v]) => v)
      );
      
      const users = await searchUsers(cleanFilters);
      setResults(users);
      setLoading(false);
    };

    fetchData();
  }, [searchParams]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v)
    );
    setSearchParams(cleanFilters);
  };

  return (
    <>
        <NavBar />
        <div className={styles.page}>
        
        <header className={styles.header}>
            <h1>Encontrar Usuários</h1>
        </header>
        
        <form onSubmit={handleSubmit} className={styles.filtersForm}>
            <div className={styles.labelGroup}>
              <label htmlFor="nome">Nome</label>
              <input id="nome" type="text" name="nome" value={filters.nome} onChange={handleFilterChange} />
            </div>

            <div className={styles.labelGroup}>
              <label htmlFor="role">Tipo de Usuário</label>
              <select id="role" name="role" value={filters.role} onChange={handleFilterChange}>
                {ROLES.map(r => (<option key={r} value={r}>{r || "Todos"}</option>))}
              </select>
            </div>

            {filters.role === 'Jogador' && (
              <>
                <div className={styles.labelGroup}>
                  <label htmlFor="posicao">Posição Principal</label>
                  <select id="posicao" name="posicao" value={filters.posicao} onChange={handleFilterChange}>
                    {POSICOES.map(p => (<option key={p} value={p}>{p || "Todas"}</option>))}
                  </select>
                </div>

                <div className={styles.labelGroup}>
                  <label htmlFor="modalidade">Modalidade</label>
                  <select id="modalidade" name="modalidade" value={filters.modalidade} onChange={handleFilterChange}>
                    {MODALIDADES.map(m => (<option key={m} value={m}>{m || "Todas"}</option>))}
                  </select>
                </div>

                <div className={styles.labelGroup}>
                  <label htmlFor="altura">Altura (cm)</label>
                  <input id="altura" type="number" name="altura" value={filters.altura} onChange={handleFilterChange} />
                </div>

                <div className={styles.labelGroup}>
                  <label htmlFor="peso">Peso (kg)</label>
                  <input id="peso" type="number" name="peso" value={filters.peso} onChange={handleFilterChange} />
                </div>

                <div className={styles.labelGroup}>
                  <label htmlFor="dominantFoot">Pé Dominante</label>
                  <select id="dominantFoot" name="dominantFoot" value={filters.dominantFoot} onChange={handleFilterChange}>
                    <option value="">Todos</option>
                    <option value="Direito">Direito</option>
                    <option value="Esquerdo">Esquerdo</option>
                    <option value="Ambidestro">Ambidestro</option>
                  </select>
                </div>

                <div className={styles.labelGroup}>
                  <label htmlFor="posicaoSecundaria">Posição Secundária</label>
                  <input id="posicaoSecundaria" type="text" name="posicaoSecundaria" value={filters.posicaoSecundaria} onChange={handleFilterChange} />
                </div>
              </>
            )}

            {filters.role === 'Olheiro' && (
              <>
                <div className={styles.labelGroup}>
                  <label htmlFor="regiao">Região</label>
                  <input id="regiao" type="text" name="regiao" value={filters.regiao} onChange={handleFilterChange} />
                </div>
                <div className={styles.labelGroup}>
                  <label htmlFor="especializacao">Especialização</label>
                  <input id="especializacao" type="text" name="especializacao" value={filters.especializacao} onChange={handleFilterChange} />
                </div>
                <div className={styles.labelGroup}>
                  <label htmlFor="clubeOlheiro">Clube do Olheiro</label>
                  <input id="clubeOlheiro" type="text" name="clubeOlheiro" value={filters.clubeOlheiro} onChange={handleFilterChange} />
                </div>
                <div className={styles.labelGroup}>
                  <label htmlFor="nivelAtuacaoOlheiro">Nível de Atuação</label>
                  <input id="nivelAtuacaoOlheiro" type="text" name="nivelAtuacaoOlheiro" value={filters.nivelAtuacaoOlheiro} onChange={handleFilterChange} />
                </div>
              </>
            )}
            
            <div className={styles.labelGroup}>
              <label htmlFor="cidade">Cidade</label>
              <input id="cidade" type="text" name="cidade" value={filters.cidade} onChange={handleFilterChange} />
            </div>
            
            <button type="submit">
              <FaUsers style={{ marginRight: '0.5rem' }} /> Aplicar Filtros
            </button>
        </form>

        <h2>{filters.nome ? `Resultados para "${filters.nome}"` : 'Usuários Encontrados'}</h2>
        
        {loading ? (
            <div className={styles.feedback}>Carregando usuários...</div>
        ) : (
            <div className={styles.resultsContainer}>
            {results.length > 0 ? (
                results.map(user => (
                <UserCard key={user.id} user={user} />
                ))
            ) : (
                <div className={styles.feedback}>Nenhum usuário encontrado com esses filtros.</div>
            )}
            </div>
        )}
        </div>
    </>
  );
};

export default SearchPage;