import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { request } from '../../services/api';
import styles from './FollowersSidebar.module.scss';

interface UserProfile {
  id: number;
  profile: {
    nome: string;
  };
  profilePictureUrl?: string;
}

interface FollowersResponse {
  followers: UserProfile[];
}

interface Props {
  userId: number;
}

const FollowersSidebar: React.FC<Props> = ({ userId }) => {
  const [followers, setFollowers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchFollowers = async () => {
      setLoading(true);
      try {
        const response = await request<FollowersResponse>({ 
          url: `/usuarios/${userId}/seguidores` 
        });
        setFollowers(response.data.followers || []);
      } catch (error) {
        console.error('Erro ao buscar seguidores:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowers();
  }, [userId]);

  return (
    <div className={styles.module}>
      <h3 className={styles.title}>Seguido por</h3>
      {loading ? (
        <p>Carregando...</p>
      ) : followers.length === 0 ? (
        <p>Ninguém segue este perfil ainda.</p>
      ) : (
        <div className={styles.userList}>
          {followers.map((user) => (
            <Link to={`/profile/${user.id}`} key={user.id} className={styles.userItem}>
              <img
                src={user.profilePictureUrl || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'}
                alt={user.profile.nome}
                className={styles.avatar}
              />
              <span>{user.profile.nome}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default FollowersSidebar;
