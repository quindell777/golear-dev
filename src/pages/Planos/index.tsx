// src/pages/FluxoPagamento/FutebolPremiumAvancado.tsx
import React, { useState } from "react";
import type { FormEvent } from "react";
import {
  FiStar,
  FiShield,
  FiActivity,
  FiArrowLeft,
  FiCheckCircle,
  FiXCircle,
  FiCreditCard,
  FiDollarSign,
  FiInfo
} from "react-icons/fi";
import Navbar from "../../components/NavBar";
import styles from "./Planos.module.scss";

interface Plano {
  id: string;
  name: string;
  price: number;
  description: string;
  benefits: string[];
  icon: React.ReactElement;
  color: string;
}

type FormaPagamento = "cartao" | "boleto" | null;

const planos: Plano[] = [
  {
    id: "amador",
    name: "Amador",
    price: 9.99,
    description: "Plano básico para acompanhar notícias e estatísticas semanais.",
    benefits: ["Feed básico", "Notícias semanais", "Estatísticas limitadas"],
    icon: <FiActivity />,
    color: "#4CAF50",
  },
  {
    id: "profissional",
    name: "Profissional",
    price: 29.99,
    description: "Plano intermediário com perfil destacado e alertas de partidas.",
    benefits: ["Tudo do Amador", "Perfil destacado", "Mais interações", "Alertas de partidas"],
    icon: <FiShield />,
    color: "#FF9800",
  },
  {
    id: "craque",
    name: "Craque",
    price: 49.99,
    description: "Plano completo com estatísticas avançadas e recursos exclusivos.",
    benefits: ["Tudo do Profissional", "Estatísticas avançadas", "Recursos exclusivos", "Acesso antecipado a novidades"],
    icon: <FiStar />,
    color: "#1B5E20",
  },
];

const FutebolPremiumAvancado: React.FC = () => {
  const [planoSelecionado, setPlanoSelecionado] = useState<Plano | null>(null);
  const [formaPagamento, setFormaPagamento] = useState<FormaPagamento>(null);
  const [pagamentoStatus, setPagamentoStatus] = useState<"sucesso" | "falha" | null>(null);

  const [formData, setFormData] = useState({
    numeroCartao: "",
    nomeCartao: "",
    validade: "",
    cvv: "",
    cpfCnpj: "",
    emailNota: "",
    endereco: "",
    telefone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Simula processamento do pagamento
    const sucesso = true;
    setPagamentoStatus(sucesso ? "sucesso" : "falha");
  };

  const etapas = ["Escolha do Plano", "Pagamento", "Confirmação"];
  const etapaAtual = pagamentoStatus ? 2 : planoSelecionado ? 1 : 0;

  return (
    <div className={styles.container}>
      <Navbar />

      {/* INDICADOR DE PROGRESSO */}
      <div className={styles.progressBar}>
        {etapas.map((etapa, i) => (
          <div key={i} className={`${styles.step} ${i <= etapaAtual ? styles.active : ""}`}>
            <span>{etapa}</span>
          </div>
        ))}
      </div>

      {!planoSelecionado && (
        <section className={styles.planos}>
          <h1 className={styles.title}>Escolha o plano ideal</h1>
          <p className={styles.subtitle}>
            Compare os benefícios e selecione o plano que potencializa sua experiência futebolística.
          </p>
          <div className={styles.plansGrid}>
            {planos.map((plano) => (
              <div
                key={plano.id}
                className={styles.planCard}
                style={{ borderColor: plano.color }}
              >
                <div className={styles.planHeader}>
                  <div className={styles.iconWrapper}>{plano.icon}</div>
                  <h2 className={styles.planName}>{plano.name}</h2>
                  <p className={styles.price}>R$ {plano.price.toFixed(2)}/mês</p>
                  <p className={styles.planDescription}>{plano.description}</p>
                </div>
                <ul className={styles.benefits}>
                  {plano.benefits.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
                <button
                  className={styles.chooseBtn}
                  style={{ backgroundColor: plano.color }}
                  onClick={() => setPlanoSelecionado(plano)}
                >
                  Selecionar Plano
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {planoSelecionado && pagamentoStatus === null && (
        <section className={styles.checkoutWrapper}>
          <div className={styles.checkoutForm}>
            <h1 className={styles.title}>Pagamento - {planoSelecionado.name}</h1>
            <p className={styles.checkoutSubtitle}>
              Preencha os dados abaixo para completar sua compra e emitir a nota fiscal.
            </p>
            <form className={styles.paymentForm} onSubmit={handleSubmit}>
              <div className={styles.paymentOptions}>
                <button
                  type="button"
                  className={`${styles.paymentOption} ${formaPagamento === "cartao" ? styles.selected : ""}`}
                  onClick={() => setFormaPagamento("cartao")}
                >
                  <FiCreditCard className={styles.iconWrapper} /> Cartão de Crédito
                </button>
                <button
                  type="button"
                  className={`${styles.paymentOption} ${formaPagamento === "boleto" ? styles.selected : ""}`}
                  onClick={() => setFormaPagamento("boleto")}
                >
                  <FiDollarSign className={styles.iconWrapper} /> Boleto Bancário
                </button>
              </div>

              {formaPagamento === "cartao" && (
                <>
                  <label>
                    Número do cartão <FiInfo title="Número completo do cartão de crédito" />
                    <input
                      type="text"
                      name="numeroCartao"
                      placeholder="0000 0000 0000 0000"
                      value={formData.numeroCartao}
                      onChange={handleChange}
                      required
                    />
                  </label>
                  <label>
                    Nome no cartão <FiInfo title="Nome impresso no cartão" />
                    <input
                      type="text"
                      name="nomeCartao"
                      placeholder="Nome completo"
                      value={formData.nomeCartao}
                      onChange={handleChange}
                      required
                    />
                  </label>
                  <div className={styles.cardRow}>
                    <label>
                      Validade <FiInfo title="MM/AA" />
                      <input
                        type="text"
                        name="validade"
                        placeholder="MM/AA"
                        value={formData.validade}
                        onChange={handleChange}
                        required
                      />
                    </label>
                    <label>
                      CVV <FiInfo title="Código de segurança atrás do cartão" />
                      <input
                        type="text"
                        name="cvv"
                        placeholder="123"
                        value={formData.cvv}
                        onChange={handleChange}
                        required
                      />
                    </label>
                  </div>
                </>
              )}

              {/* Dados nota fiscal */}
              <label>
                CPF/CNPJ <FiInfo title="Documento para emissão de nota fiscal" />
                <input
                  type="text"
                  name="cpfCnpj"
                  placeholder="000.000.000-00 ou 00.000.000/0000-00"
                  value={formData.cpfCnpj}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                E-mail para nota fiscal <FiInfo title="Receba a nota fiscal neste e-mail" />
                <input
                  type="email"
                  name="emailNota"
                  placeholder="seu@email.com"
                  value={formData.emailNota}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Endereço completo
                <input
                  type="text"
                  name="endereco"
                  placeholder="Rua, número, bairro, cidade, CEP"
                  value={formData.endereco}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Telefone
                <input
                  type="tel"
                  name="telefone"
                  placeholder="(00) 00000-0000"
                  value={formData.telefone}
                  onChange={handleChange}
                  required
                />
              </label>

              <button type="submit" className={styles.payBtn}>Confirmar Pagamento</button>
              <button type="button" className={styles.backBtn} onClick={() => setPlanoSelecionado(null)}>
                <FiArrowLeft /> Voltar aos Planos
              </button>
            </form>
          </div>

          {/* Sidebar dinâmica */}
          <aside className={styles.sidebar}>
            <h2>Resumo do Plano</h2>
            <p><strong>{planoSelecionado.name}</strong></p>
            <p>R$ {planoSelecionado.price.toFixed(2)}/mês</p>
            <ul>
              {planoSelecionado.benefits.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>

            {formaPagamento === "cartao" && (
              <div className={styles.sidebarDetails}>
                <p><strong>Cartão selecionado:</strong> {formData.numeroCartao ? `**** **** **** ${formData.numeroCartao.slice(-4)}` : "Não preenchido"}</p>
                <p><strong>Nome no cartão:</strong> {formData.nomeCartao || "-"}</p>
                <p><strong>Validade:</strong> {formData.validade || "-"}</p>
              </div>
            )}
          </aside>
        </section>
      )}

      {/* CONFIRMAÇÃO */}
      {pagamentoStatus !== null && (
        <section className={styles.confirmacao}>
          {pagamentoStatus === "sucesso" ? (
            <>
              <FiCheckCircle className={styles.iconSuccess} />
              <h1 className={styles.success}>Pagamento Realizado com Sucesso!</h1>
              <p>Você agora tem acesso completo ao plano <strong>{planoSelecionado?.name}</strong>.</p>
            </>
          ) : (
            <>
              <FiXCircle className={styles.iconFail} />
              <h1 className={styles.fail}>Falha no Pagamento</h1>
              <p>Ocorreu um problema ao processar sua transação.</p>
            </>
          )}
          <button className={styles.backBtn} onClick={() => setPlanoSelecionado(null)}>Voltar aos Planos</button>
        </section>
      )}
    </div>
  );
};

export default FutebolPremiumAvancado;
