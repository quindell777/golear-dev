import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Register.module.scss";
import { registerUser } from "../../services/register";
import axios from "axios";

const Register: React.FC = () => {
  const navigate = useNavigate();

  // Estado dos dados do formulário
  const [form, setForm] = useState({
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: "",
    role: "Jogador",
    nome: "",
    posicao: "",
    cidade: "",
    regiao: "",
    area_de_atuacao: "",
    estado: "",
  });

  // Estado para gerenciar erros de CADA campo
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  // Novos estados para validação de email
  const [isEmailValidating, setIsEmailValidating] = useState(false);
  const [isEmailValidated, setIsEmailValidated] = useState(false);
  const [validationMessage, setValidationMessage] = useState({ type: '', text: '' });


  // Limpa o erro do campo assim que o usuário começa a digitar nele
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Se o email for alterado, a validação anterior é resetada
    if (name === 'email') {
      setIsEmailValidated(false);
      setValidationMessage({ type: '', text: '' });
    }
    
    // Limpa o erro do campo específico e o erro global ao digitar
    if (errors[name] || errors.global) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        delete newErrors.global;
        return newErrors;
      });
    }
  };

  const handleValidateEmail = async () => {
    if (!form.email) {
      setValidationMessage({ type: 'error', text: 'Por favor, insira um e-mail para validar.' });
      return;
    }
    
    setIsEmailValidating(true);
    setValidationMessage({ type: '', text: '' });

    try {
      const apiKey = import.meta.env.VITE_ABSTRACT_API_KEY;
      if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
        throw new Error("A chave da API de validação de email não está configurada.");
      }

      const response = await axios.get(`https://emailvalidation.abstractapi.com/v1/?api_key=${apiKey}&email=${form.email}`);

      if (response.data && response.data.is_smtp_valid && response.data.is_smtp_valid.value === true) {
        setIsEmailValidated(true);
        setValidationMessage({ type: 'success', text: 'E-mail validado com sucesso!' });
      } else {
        setIsEmailValidated(false);
        setValidationMessage({ type: 'error', text: 'Este e-mail não é válido ou não pôde ser verificado.' });
      }
    } catch (error) {
      console.error("Erro na validação de e-mail:", error);
      setIsEmailValidated(false);
      setValidationMessage({ type: 'error', text: 'Ocorreu um erro ao validar o e-mail. Verifique a chave da API.' });
    } finally {
      setIsEmailValidating(false);
    }
  };


  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (form.email !== form.confirmEmail) {
      newErrors.confirmEmail = "Os e-mails não coincidem.";
    }
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem.";
    }
    if (form.password.length > 0 && form.password.length < 6) {
      newErrors.password = "A senha deve ter no mínimo 6 caracteres.";
    }

    setErrors(newErrors);
    // Retorna true se não houver erros
    return Object.keys(newErrors).length === 0;
  };

  const processUserRegistration = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!isEmailValidated) {
        setErrors((prev) => ({ ...prev, global: "Por favor, valide seu e-mail antes de continuar." }));
        return;
    }

    try {
      setLoading(true);

      const payload: any = {
        email: form.email,
        password: form.password,
        role: form.role,
        nome: form.nome,
      };

      if (form.role === "Jogador") payload.posicao = form.posicao;
      if (form.role === "Clube") payload.cidade = form.cidade;
      if (form.role === "Olheiro") payload.regiao = form.regiao;
      if (form.role === "Profissional") {
        payload.area_de_atuacao = form.area_de_atuacao;
        payload.estado = form.estado;
      }

      const response = await registerUser(payload);
      console.log("Usuário registrado:", response);
      navigate("/feed");

    } catch (error: any) {
      console.error("Erro ao registrar:", error);
      
      const msg = error.response?.data?.message || "Ocorreu um erro inesperado.";
      
      if (error.response?.status === 409) {
        setErrors((prev) => ({ ...prev, email: msg }));
      } else {
        setErrors((prev) => ({ ...prev, global: msg }));
      }
    } finally {
      setLoading(false);
    }
  };

  const getValidationButtonClass = () => {
    if (isEmailValidating) return `${styles.validationButton} ${styles.isValidating}`;
    if (isEmailValidated) return `${styles.validationButton} ${styles.isValid}`;
    return styles.validationButton;
  }

  return (
    <div className={styles.registerContainer}>
      <form className={styles.registerForm} onSubmit={processUserRegistration}>
        <h1 className={styles.title}>Crie sua conta</h1>

        {errors.global && <div className={styles.globalError}>{errors.global}</div>}

        <div className={styles.inputGroup}>
            <div className={styles.inputWithButton}>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleInputChange}
                    required
                    className={styles.input}
                    style={errors.email ? { borderColor: '#ef4444' } : {}}
                    disabled={isEmailValidated}
                />
                <button
                    type="button"
                    onClick={handleValidateEmail}
                    className={getValidationButtonClass()}
                    disabled={isEmailValidating || isEmailValidated}
                >
                    {isEmailValidating ? "Validando..." : isEmailValidated ? "Validado" : "Validar Email"}
                </button>
            </div>
          {errors.email && <span className={styles.errorText}>{errors.email}</span>}
          {validationMessage.text && 
            <span className={`${styles.validationMessage} ${styles[validationMessage.type]}`}>
              {validationMessage.text}
            </span>
          }
        </div>

        <div className={styles.inputGroup}>
          <input
            type="email"
            name="confirmEmail"
            placeholder="Confirmar email"
            value={form.confirmEmail}
            onChange={handleInputChange}
            required
            className={styles.input}
            style={errors.confirmEmail ? { borderColor: '#ef4444' } : {}}
          />
          {errors.confirmEmail && <span className={styles.errorText}>{errors.confirmEmail}</span>}
        </div>

        <div className={styles.inputGroup}>
          <input
            type="password"
            name="password"
            placeholder="Senha"
            value={form.password}
            onChange={handleInputChange}
            required
            className={styles.input}
            style={errors.password ? { borderColor: '#ef4444' } : {}}
          />
          {errors.password && <span className={styles.errorText}>{errors.password}</span>}
        </div>

        <div className={styles.inputGroup}>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirmar senha"
            value={form.confirmPassword}
            onChange={handleInputChange}
            required
            className={styles.input}
            style={errors.confirmPassword ? { borderColor: '#ef4444' } : {}}
          />
          {errors.confirmPassword && <span className={styles.errorText}>{errors.confirmPassword}</span>}
        </div>

        <div className={styles.inputGroup}>
          <select
            name="role"
            value={form.role}
            onChange={handleInputChange}
            className={styles.input}
          >
            <option value="Jogador">Jogador</option>
            <option value="Clube">Clube</option>
            <option value="Olheiro">Olheiro</option>
            <option value="Fã">Fã</option>
            <option value="Profissional">Profissional</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <input
            type="text"
            name="nome"
            placeholder="Nome Completo"
            value={form.nome}
            onChange={handleInputChange}
            required
            className={styles.input}
          />
        </div>

        {form.role === "Jogador" && (
          <div className={styles.inputGroup}>
            <input
              type="text"
              name="posicao"
              placeholder="Posição"
              value={form.posicao}
              onChange={handleInputChange}
              className={styles.input}
            />
          </div>
        )}

        {form.role === "Clube" && (
          <div className={styles.inputGroup}>
            <input
              type="text"
              name="cidade"
              placeholder="Cidade"
              value={form.cidade}
              onChange={handleInputChange}
              className={styles.input}
            />
          </div>
        )}

        {form.role === "Olheiro" && (
          <div className={styles.inputGroup}>
            <input
              type="text"
              name="regiao"
              placeholder="Região de Atuação"
              value={form.regiao}
              onChange={handleInputChange}
              className={styles.input}
            />
          </div>
        )}

        {form.role === "Profissional" && (
          <>
            <div className={styles.inputGroup}>
              <input
                type="text"
                name="area_de_atuacao"
                placeholder="Área de Atuação (ex: Fisioterapeuta)"
                value={form.area_de_atuacao}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <input
                type="text"
                name="estado"
                placeholder="Estado (ex: SP)"
                value={form.estado}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>
          </>
        )}

        <div className={styles.buttons}>
          <button type="submit" className={styles.submitButton} disabled={loading || !isEmailValidated}>
            {loading ? "Registrando..." : "Finalizar Registro"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;