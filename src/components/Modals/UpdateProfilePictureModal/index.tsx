import React, { useState } from "react";
import { request } from "../../../services/api";
import styles from "./UpdateProfilePictureModal.module.scss";
import { useAuth } from "../../../context/AuthContext";

interface Props {
  onClose: () => void;
}

const UpdateProfilePictureModal: React.FC<Props> = ({ onClose }) => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { refreshProfile } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setError("");
    }
  };

  const handleRemoveImage = () => {
    const confirmRemove = window.confirm("Tem certeza que deseja remover a imagem?");
    if (confirmRemove) {
      setImage(null);
      setPreview(null);
    }
  };

  const handleSubmit = async () => {
    if (!image) {
      setError("Por favor, selecione um arquivo de imagem.");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("profilePicture", image);

    try {
      await request({
        url: "/perfil/foto",
        method: "POST",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await refreshProfile();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Falha ao atualizar a foto. Verifique o arquivo e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2>Alterar Foto de Perfil</h2>
        <p>Selecione e visualize sua nova imagem de perfil antes de salvar.</p>

        <div className={styles.uploadBox}>
          {!preview && (
            <>
              <input
                id="profile-pic-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              <label htmlFor="profile-pic-upload" className={styles.uploadButton}>
                Escolher imagem
              </label>
            </>
          )}

          {preview && (
            <>
              <div className={styles.imagePreview}>
                <img src={preview} alt="Pré-visualização" />
              </div>
              <div className={styles.imageActions}>
                <label htmlFor="profile-pic-upload" className={styles.changeButton}>
                  Mudar imagem
                  <input
                    id="profile-pic-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    hidden
                  />
                </label>
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={handleRemoveImage}
                >
                  Remover
                </button>
              </div>
            </>
          )}
        </div>

        {error && <p className={styles.errorMessage}>{error}</p>}

        <div className={styles.actions}>
          <button onClick={onClose} className={styles.cancelButton}>
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !image}
            className={styles.submitButton}
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfilePictureModal;
