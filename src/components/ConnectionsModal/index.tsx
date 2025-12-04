import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { request } from '../../services/api';
import styles from './ConnectionsModal.module.scss';
import { FaTimes } from 'react-icons/fa';

interface UserProfile {
  id: number;
  email: string;
  role: string;
  profilePictureUrl?: string;
  profile: {
    nome: string;
  };
}

interface ConnectionsResponse {
  followers?: UserProfile[];
  following?: UserProfile[];
}

interface Props {
  title: string;
  endpoint: string;
  onClose: () => void;
}

const ConnectionsModal: React.FC<Props> = ({ title, endpoint, onClose }) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await request<ConnectionsResponse>({ url: endpoint });
        const userList = response.data.followers || response.data.following || [];
        setUsers(userList);
      } catch (error) {
        console.error(`Erro ao buscar ${title}:`, error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [endpoint, title]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <h3>{title}</h3>
          <button onClick={onClose} className={styles.closeButton}>
            <FaTimes />
          </button>
        </header>
        <div className={styles.userList}>
          {loading ? (
            <p>Carregando...</p>
          ) : users.length === 0 ? (
            <p>Nenhum usuário encontrado.</p>
          ) : (
            users.map((user) => (
              <Link to={`/profile/${user.id}`} key={user.id} className={styles.userItem} onClick={onClose}>
                <img
                  src={user.profilePictureUrl || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'}
                  alt={user.profile.nome}
                  className={styles.avatar}
                />
                <span>{user.profile.nome}</span>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ConnectionsModal;
