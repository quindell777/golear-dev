import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { request } from '../../services/api';
import styles from './UserRecommendations.module.scss';
import { FaUserPlus } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

// --- Tipagens ---

// 1. Tipagem do Objeto Bruto (Retornado do Backend)
interface RawRecommendation {
    id: number;
    nome: string;
    tipo: 'Jogador' | 'Clube' | 'Olheiro' | 'Profissional' | 'Fã'; // O 'tipo' é retornado como 'role'
    cidade?: string;
    regiao?: string;
    posicao_principal?: string; // Campo para Jogadores
    posicao?: string; // Pode ser um fallback
    url_foto?: string; // Assumindo que o campo da foto é 'url_foto'
    email?: string;
    // ... outros campos de DB
    [key: string]: any; 
}

// 2. Tipagem do Objeto Mapeado (Esperado pelo Frontend)
interface Recommendation {
    user: {
        id: number;
        email: string;
        role: string;
        profilePictureUrl?: string;
    };
    profile: {
        nome: string;
        posicao?: string;
        cidade?: string;
        regiao?: string;
    };
}

// 3. Tipagem da Resposta da API (Corrigida para usar 'data')
interface RecommendationsResponse {
    success: boolean;
    message?: string;
    data: RawRecommendation[]; // O backend envia a lista no campo 'data'
}

// --- Componente ---

const UserRecommendations: React.FC = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        
        // Tipamos com a resposta corrigida (que contém 'data')
        const response = await request<RecommendationsResponse>({
          url: '/api/recomendacoes/api',
          method: 'GET',
        });

        if (response.data.success) {
            // 🚨 Correção 1: Acessar o campo 'data' da resposta
            const rawResults = response.data.data || [];
            
            // 🚨 Correção 2: Mapear o formato bruto para o formato esperado (user/profile)
            const mappedRecs: Recommendation[] = rawResults.map((item: RawRecommendation) => ({
                user: {
                    id: item.id,
                    email: item.email || `${item.nome.toLowerCase().replace(/\s/g, '')}@golear.com`, // Fallback de email
                    role: item.tipo, // Usa o 'tipo' do DB como 'role'
                    profilePictureUrl: item.url_foto || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
                },
                profile: {
                    nome: item.nome,
                    posicao: item.posicao_principal || item.posicao,
                    cidade: item.cidade,
                    regiao: item.regiao,
                }
            }));
            
            // Filter out current user
            const filteredRecs = mappedRecs.filter(rec => rec.user.id !== user?.id);
            setRecommendations(filteredRecs);

        } else {
          setError(response.data.message || 'Erro desconhecido ao carregar.');
        }
      } catch (err) {
        setError('Erro ao carregar recomendações.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
        fetchRecommendations();
    } else {
        setLoading(false);
    }
  }, [user]);

  // Se não houver recomendações ou o usuário não estiver logado, não renderiza nada.
  if (!user || recommendations.length === 0) {
      return null;
  }

  return (
    <section className={styles.block}>
      <h3 className={styles.blockTitle}>
        <FaUserPlus className={styles.icon} /> Recomendações
      </h3>
      {loading && <p>Carregando...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && (
        <div className={styles.recommendationsList}>
          {recommendations.map((rec) => (
            <Link to={`/profile/${rec.user.id}`} key={rec.user.id} className={styles.recItem}>
              <img
                src={rec.user.profilePictureUrl} // Já possui o fallback no mapeamento
                alt={rec.profile.nome}
                className={styles.avatar}
              />
              <div className={styles.userInfo}>
                <strong>{rec.profile.nome}</strong>
                <span>{rec.user.role}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default UserRecommendations;