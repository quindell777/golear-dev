// src/pages/Settings.tsx
import React from 'react';
import Modal from '../../components/Modals/Modal';
import { useAuth } from '../../context/AuthContext';

interface Props { 
  onClose: () => void;
}

const Settings: React.FC<Props> = ({ onClose }) => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();  // limpa token e usuário
    onClose(); // fecha o modal
  };

  return (
    <Modal title="Configurações" onClose={onClose}>
      <p>Tem certeza que deseja sair da sua conta?</p>
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: '#f44336',
            color: '#fff',
            padding: '8px 16px',
            borderRadius: 6,
            border: 'none',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Sair
        </button>
        <button
          onClick={onClose} // Simplesmente fecha o modal
          style={{
            backgroundColor: '#ccc',
            color: '#000',
            padding: '8px 16px',
            borderRadius: 6,
            border: 'none',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Cancelar
        </button>
      </div>
    </Modal>
  );
};

export default Settings;