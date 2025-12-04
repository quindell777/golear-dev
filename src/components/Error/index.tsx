import React from 'react';
import styles from './Error.module.scss';

// Interface para props do componente
interface ErrorProps {
  message: string; // Mensagem de erro
  onRetry: () => void; // Função para tentar novamente
}

// Componente funcional para erro
const Error: React.FC<ErrorProps> = ({ message, onRetry }) => (
  <div
    className={styles.error}
    role="alert" // Acessibilidade: indica erro
    aria-live="assertive" // Acessibilidade: lê erro
  >
    {/* Mensagem de erro */}
    <p>{message}</p>
    {/* Botão para tentar novamente */}
    <button onClick={onRetry} aria-label="Tentar novamente">
      Tentar novamente
    </button>
  </div>
);

export default Error;