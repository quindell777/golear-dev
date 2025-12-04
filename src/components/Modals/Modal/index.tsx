// src/components/Modal.tsx
import React from 'react';
import styles from './Modal.module.scss';
import { FaTimes } from 'react-icons/fa';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, onClose, children }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <header className={styles.header}>
          <h2>{title}</h2>
          <button onClick={onClose}><FaTimes /></button>
        </header>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
