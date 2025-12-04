// src/pages/ProfileWrapper.tsx
import React from "react";
import { useParams } from "react-router-dom";
import Profile from "../Profile";
import { useAuth } from "../../context/AuthContext";

const ProfileWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // pega id da URL
  const { user } = useAuth();                // pega dados do usuário logado

  if (!id || !user) return <p>Carregando perfil...</p>;

  return <Profile />;
};

export default ProfileWrapper;
