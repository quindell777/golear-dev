// Importa React para JSX
import React from 'react';
// SCSS Module para isolamento de estilos
import styles from './Loading.module.scss';

// Interface para props (mensagem opcional)
interface LoadingProps {
  message?: string; // Mensagem a ser exibida
}

// Componente funcional para loading
const Loading: React.FC<LoadingProps> = ({ message = 'Loading...' }) => (
  // Div com classe para estilização
  <div className={styles.loading} role="status" aria-live="polite">
    {/* Spinner para feedback visual */}
    <div className={styles.spinner} />
    {/* Texto de mensagem */}
    <p>{message}</p>
  </div>
);

export default Loading;