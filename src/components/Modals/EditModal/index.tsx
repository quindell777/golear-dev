import React from "react";
import styles from "./EditModal.module.scss";
import type { Profile } from "../../../types";

interface EditModalProps {
  editData: Partial<Profile>;
  setEditData: (data: Partial<Profile>) => void;
  onSave: () => void;
  onCancel: () => void;
}


// 1. Definição das Constantes
const MAX_TOTAL_POINTS = 45;
const STAT_LABELS = [
  "Velocidade",
  "Força",
  "Técnica",
  "Passe",
  "Defesa",
  "Finalização",
];

const INITIAL_STATS: number[] = STAT_LABELS.map(() => 0); // Array limpo de 6 zeros

const EditModal: React.FC<EditModalProps> = ({
  editData,
  setEditData,
  onSave,
  onCancel,
}) => {

  const handleChange = (field: keyof Profile, value: any) => {
    setEditData({ ...editData, [field]: value });
  };



  const handleSaveClick = () => {
    if (!editData.nome || !editData.role) {
      alert("Por favor, preencha Nome e Cargo/Role.");
      return;
    }
    onSave();
  };



  const isJogador = editData.role === "Jogador";
  const isClube = editData.role === "Clube";
  const isOlheiro = editData.role === "Olheiro";
  const isFa = editData.role === "Fã";
  const isProfissional = editData.role === "Profissional";



  // 2. Criação do array de estatísticas seguro para uso (fora da função handleStatChange)
  // Isso resolve a maioria dos warnings de uso global.
  const statsForCalculation: number[] = (editData.estatisticas || INITIAL_STATS).map(
    (stat) => stat ?? 0 // Garante que todos os elementos são números
  );

  // 3. Cálculo para exibição no JSX (Contador) - CORRIGIDO
  const totalPointsUsed = statsForCalculation.reduce(
    (acc: number, val: number) => acc + val, // TS infere acc como number, mas forçamos val como number
    0
  );
  const pointsRemaining = MAX_TOTAL_POINTS - totalPointsUsed;

  // 4. Função de manipulação de estatísticas ATUALIZADA e CORRIGIDA
  const handleStatChange = (index: number, attemptedNewValue: number) => {
    // 4.1. Garante que o valor individual está entre 0 e 10
    let finalNewValue = Math.max(0, Math.min(10, attemptedNewValue));
    // 4.2. Obtém as estatísticas atuais de forma segura
    const currentStats = [...statsForCalculation];
    // 4.3. Calcula os pontos usados nas OUTRAS estatísticas
    const totalUsedExcludingCurrent = currentStats.reduce(
      (acc: number, val: number, idx: number) => {
        // CORREÇÃO: Usamos o tipo number para o acumulador 'acc' e 'val' para resolver o bug
        return idx === index ? acc : acc + val;
      },
      0
    );
    // 4.4. Calcula o total de pontos disponíveis para gasto
    const pointsAvailable = MAX_TOTAL_POINTS - totalUsedExcludingCurrent;
    // 4.5. Aplica a restrição de limite total
    if (finalNewValue > pointsAvailable) {
      finalNewValue = Math.max(0, Math.min(10, pointsAvailable));
    }
    // 4.6. Atualiza o array de estatísticas
    currentStats[index] = finalNewValue;
    // 4.7. Atualiza o estado
    handleChange("estatisticas", currentStats);
  };
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Editar Perfil</h2>
        {/* Nome e Role lado a lado */}
        <div className={styles.section}>
          <label>
            Nome *
            <input
              type="text"
              value={editData.nome || ""}
              onChange={(e) => handleChange("nome", e.target.value)}
            />
          </label>
          <label>
            Cargo / Role *
            <select
              value={editData.role || ""}
              onChange={(e) =>
                handleChange("role", e.target.value as Profile["role"])
              }
            >
              <option value="">Selecione</option>
              <option value="Jogador">Jogador</option>
              <option value="Clube">Clube</option>
              <option value="Olheiro">Olheiro</option>
              <option value="Fã">Fã</option>
              <option value="Profissional">Profissional</option>
            </select>
          </label>
        </div>
        {/* Bio full width */}
        <div className={`${styles.section} ${styles.fullWidth}`}>
          <label>
            Bio
            <textarea
              value={editData.bio || ""}
              onChange={(e) => handleChange("bio", e.target.value)}
            />
          </label>
        </div>

        {/* Jogador */}
        {isJogador && (
          <>
            <div className={styles.section}>
              <label>
                Estado / Cidade / Região
                <input
                  type="text"
                  value={editData.cidade || ""}
                  onChange={(e) => handleChange("cidade", e.target.value)}
                />
              </label>
              <label>
                Posição principal
                <input
                  type="text"
                  value={editData.posicaoPrincipal || ""}
                  onChange={(e) =>
                    handleChange("posicaoPrincipal", e.target.value)
                  }
                />
              </label>
              <label>
                Posição secundária
                <input
                  type="text"
                  value={editData.posicaoSecundaria || ""}
                  onChange={(e) =>
                    handleChange("posicaoSecundaria", e.target.value)
                  }
                />
              </label>

              <label>
                Perna dominante
                <select
                  value={editData.dominantFoot || ""}
                  onChange={(e) =>
                    handleChange(
                      "dominantFoot",
                      e.target.value as Profile["dominantFoot"]
                    )
                  }
                >
                  <option value="">Selecione</option>
                  <option value="Direito">Direito</option>
                  <option value="Esquerdo">Esquerdo</option>
                  <option value="Ambidestro">Ambidestro</option>
                </select>
              </label>
              <label>
                Altura (cm)
                <input
                  type="number"
                  value={editData.altura || ""}
                  onChange={(e) => handleChange("altura", Number(e.target.value))}
                />
              </label>
              <label>
                Peso (kg)
                <input
                  type="number"
                  value={editData.peso || ""}
                  onChange={(e) => handleChange("peso", Number(e.target.value))}
                />
              </label>
              <label>
                Idade
                <input
                  type="number"
                  min={5}
                  max={99}
                  value={editData.idade || ""}
                  onChange={(e) => handleChange("idade", Number(e.target.value))}
                />
              </label>
              <label>
                Atua em:
                <div className={styles.checkboxGroup}>
                  {["Futsal", "Society", "Campo"].map((tipo) => (
                    <label key={tipo}>
                      <input
                        type="checkbox"
                        checked={(editData.tipoAtuacao || []).includes(tipo)}
                        onChange={() => {
                          const currentTipoAtuacao = editData.tipoAtuacao || [];
                          const newTipoAtuacao = currentTipoAtuacao.includes(tipo)
                            ? currentTipoAtuacao.filter((item) => item !== tipo)
                            : [...currentTipoAtuacao, tipo];
                          handleChange("tipoAtuacao", newTipoAtuacao);
                        }}
                      />
                      {tipo}
                    </label>
                  ))}
                </div>
              </label>
            </div>
            <div className={`${styles.section} ${styles.fullWidth}`}>
              <label>
                Estilo de jogo / Características
                <textarea
                  value={editData.caracteristicas || ""}
                  onChange={(e) =>
                    handleChange("caracteristicas", e.target.value)
                  }
                />
              </label>
              <label>
                Referência (Jogador que se inspira)
                <input
                  type="text"
                  value={editData.referencia || ""}
                  onChange={(e) => handleChange("referencia", e.target.value)}
                />
              </label>
            </div>
            {/* Contador de Pontos */}
            <div className={styles.statsHeader}>
                <h3>Distribuição de Habilidades</h3>
                <p>
                    Pontos disponíveis:
                    <span className={styles.pointsCounter}>
                        {pointsRemaining} / {MAX_TOTAL_POINTS}
                    </span>
                </p>
            </div>
            <div className={styles.statsContainer}>
              {STAT_LABELS.map(
                (label, index) => (
                  <label key={index}>
                    {label}
                    <input
                      type="number"
                      min={0}
                      max={10}
                      // Renderiza o valor seguro do array 'statsForCalculation'
                      value={statsForCalculation[index]}
                      onChange={(e) =>
                        handleStatChange(index, Number(e.target.value))
                      }
                      disabled={pointsRemaining === 0 && statsForCalculation[index] === 0}
                    />
                  </label>
                )
              )}
              <p>Tente ser o mais sincero possível com suas habilidades</p>
            </div>
            <div className={styles.section}>
              <label>
                WhatsApp
                <input
                  type="text"
                  value={editData.whatsapp || ""}
                  onChange={(e) => handleChange("whatsapp", e.target.value)}
                />
              </label>
              <label>
                Instagram
                <input
                  type="text"
                  value={editData.instagram || ""}
                  onChange={(e) => handleChange("instagram", e.target.value)}
                />
              </label>
              <label>
                Twitter / X
                <input
                  type="text"
                  value={editData.twitter || ""}
                  onChange={(e) => handleChange("twitter", e.target.value)}
                />
              </label>
            </div>
          </>
        )}
        {/* Clube */}
        {isClube && (
          <div className={`${styles.section} ${styles.fullWidth}`}>
            <label>
              Região / Localização
              <input
                type="text"
                value={editData.regiao || ""}
                onChange={(e) => handleChange("regiao", e.target.value)}
              />
            </label>
            <label>
              Histórico do Clube
              <textarea
                value={editData.historicoClubes || ""}
                onChange={(e) =>
                  handleChange("historicoClubes", e.target.value)
                }
              />
            </label>
            <label>
              Modalidade de atuação
              <input
                type="text"
                value={editData.especializacao || ""}
                onChange={(e) => handleChange("especializacao", e.target.value)}
              />
            </label>
            <label>
              Categoria / faixa etária
              <input
                type="text"
                value={editData.categoriaClube || ""}
                onChange={(e) => handleChange("categoriaClube", e.target.value)}
              />
            </label>
            <label>
              Procurando jogadores para a seguinte posição
              <input
                type="text"
                value={editData.posicaoProcurada || ""}
                onChange={(e) => handleChange("posicaoProcurada", e.target.value)}
              />
            </label>
            <label>
              Divisao em que compete
              <input
                type="text"
                value={editData.divisao || ""}
                onChange={(e) => handleChange("divisao", e.target.value)}
              />
            </label>
            <label>
              Competições em que participa
              <input
                type="text"
                value={editData.competicoesParticipa || ""}
                onChange={(e) => handleChange("competicoesParticipa", e.target.value)}
              />
            </label>
            <label>
              Titulos Conquistados
              <input
                type="text"
                value={editData.titulos || ""}
                onChange={(e) => handleChange("titulos", e.target.value)}
              />
            </label>
          </div>
        )}

        {/* Olheiro */}
        {isOlheiro && (
          <div className={`${styles.section} ${styles.fullWidth}`}>
            <label>
              Área de Atuação / Região
              <input
                type="text"
                value={editData.areaAtuacao || ""}
                onChange={(e) => handleChange("areaAtuacao", e.target.value)}
              />
            </label>
            <label>
              modalidade de especialização
              <input
                type="text"
                value={editData.especializacao || ""}
                onChange={(e) => handleChange("especializacao", e.target.value)}
              />
            </label>
            <label>
              Experiência
              <textarea
                value={editData.experiencia || ""}
                onChange={(e) => handleChange("experiencia", e.target.value)}
              />
            </label>
            <label>
              trabalha para qual clube(s) ou agência(s)
              <textarea
                value={editData.clubeOlheiro || ""}
                onChange={(e) => handleChange("clubeOlheiro", e.target.value)}
              />
            </label>
            <label>
              Nivel de atuação
              <textarea
                value={editData.nivelAtuacaoOlheiro || ""}
                onChange={(e) => handleChange("nivelAtuacaoOlheiro", e.target.value)}
              />
            </label>
          </div>
        )}

        {/* Fã */}
        {isFa && (
          <div className={styles.section}>
            <label>
              Time do coração
              <input
                type="text"
                value={editData.time_coracao || ""}
                onChange={(e) => handleChange("time_coracao", e.target.value)}
              />
            </label>
            <label>
              Jogador favorito
              <input
                type="text"
                value={editData.jogador_favorito || ""}
                onChange={(e) => handleChange("jogador_favorito", e.target.value)}
              />
            </label>
            <label>
              Interesses
              <input
                type="text"
                value={editData.especializacao || ""}
                onChange={(e) => handleChange("especializacao", e.target.value)}
              />
            </label>
            <div className={styles.section}>
              <label>
                WhatsApp
                <input
                  type="text"
                  value={editData.whatsapp || ""}
                  onChange={(e) => handleChange("whatsapp", e.target.value)}
                />
              </label>
              <label>
                Instagram
                <input
                  type="text"
                  value={editData.instagram || ""}
                  onChange={(e) => handleChange("instagram", e.target.value)}
                />
              </label>
              <label>
                Twitter / X
                <input
                  type="text"
                  value={editData.twitter || ""}
                  onChange={(e) => handleChange("twitter", e.target.value)}
                />
              </label>
            </div>
          </div>
        )}

        {/* Profissional */}
        {isProfissional && (
          <div className={`${styles.section} ${styles.fullWidth}`}>
            <label>
              Profissão
              <input
                type="text"
                value={editData.especializacao || ""}
                onChange={(e) => handleChange("especializacao", e.target.value)}
              />
            </label>
            <label>
              Região de atuação
              <input
                type="text"
                value={editData.regiao || ""}
                onChange={(e) => handleChange("regiao", e.target.value)}
              />
            </label>
            <label>
              Experiência
              <textarea
                value={editData.experiencia || ""}
                onChange={(e) => handleChange("experiencia", e.target.value)}
              />
            </label>
          </div>
        )}

        {isProfissional && (
          <div className={styles.section}>
            <label>
              WhatsApp
              <input
                type="text"
                value={editData.whatsapp || ""}
                onChange={(e) => handleChange("whatsapp", e.target.value)}
              />
            </label>
            <label>
              Instagram
              <input
                type="text"
                value={editData.instagram || ""}
                onChange={(e) => handleChange("instagram", e.target.value)}
              />
            </label>
            <label>
              Twitter / X
              <input
                type="text"
                value={editData.twitter || ""}
                onChange={(e) => handleChange("twitter", e.target.value)}
              />
            </label>
          </div>
        )}

        {/* Ações */}
        <div className={styles.modalActions}>
          <button className={styles.saveButton} onClick={handleSaveClick}>
            Salvar
          </button>
          <button className={styles.cancelButton} onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
