// src/types/index.ts

// ==================================================
// 🔐 Autenticação e Usuários
// ==================================================

export interface User {
  id: number; // Identificador único (PK)
  email: string; // Email de login
  role: "Jogador" | "Clube" | "Olheiro" | "Fã" | "Profissional"; // Tipo de usuário
  createdAt: string; // Data de criação ISO
  profilePictureUrl?: string; // URL do avatar
  bio: string; // Biografia curta
  estatisticas: any[]; // Estatísticas (substituir futuramente)
  dominantFoot: "Direito" | "Esquerdo" | "Ambidestro" | null; // Pé dominante
  especializacao: string | null; // Área de atuação / especialização
}

export interface AuthResponse {
  success: boolean; // Indica sucesso
  message: string; // Mensagem da API
  token: string; // Token JWT
  user: User; // Usuário autenticado
}

export interface PasswordRescueResponse {
  success: boolean; // Sucesso do envio
  message: string; // Mensagem informativa
  token: string; // Token de recuperação
}

export interface PasswordChangeRequest {
  email: string; // Email do usuário
  novaSenha: string; // Nova senha
  token: string; // Token recebido por email
}

// ==================================================
// 📝 Posts e Feed
// ==================================================

export interface PostAuthor {
  name: string; // Nome do autor
  email: string; // Email do autor
  role: string; // Papel (Jogador, Clube, etc.)
  profilePictureUrl?: string; // Avatar do autor
}

export interface Post {
  id: number; // ID do post
  titulo: string; // Título
  conteudo: string; // Conteúdo textual
  usuarioId: number; // FK para usuário
  createdAt: string; // Data ISO
  imageUrl?: string; // Imagem opcional
  mediaType?: "image" | "video"; // Tipo de mídia
  likedByCurrentUser?: boolean; // Se usuário curtiu
  likes?: number; // Total de curtidas
  author?: PostAuthor; // Autor do post
  _count?: { comentarios: number }; // Contador de comentários
}

export interface Comment {
  id: number; // ID do comentário
  texto: string; // Texto
  createdAt: string; // Data ISO
  autor: {
    id: number; // ID do autor
    nome: string; // Nome
    role: string; // Papel
    profilePictureUrl?: string; // Avatar
  };
}

export interface PostsResponse {
  success: boolean; // Sucesso
  message: string; // Mensagem
  posts: Post[]; // Lista de posts
  total: number; // Total para paginação
}

// ==================================================
// 👤 Jogadores / Perfis
// ==================================================

export interface Player {
  id: number; // ID do jogador
  nome: string; // Nome
  posicao: string; // Posição principal
  caracteristicas: string; // Características
  historicoClubes: string; // Histórico de clubes
  UserId: number; // FK para User
  avatar?: string; // URL do avatar
  banner?: string; // URL do banner
}

export interface PlayerSearchResponse {
  success: boolean; // Sucesso
  message: string; // Mensagem
  jogadores: Player[]; // Lista de jogadores
  total: number; // Total
  filtros: { nome: string | null; posicao: string | null; caracteristicas: string | null }; // Filtros aplicados
}

// ==================================================
// 👥 Perfil unificado (campos dinâmicos por tipo)
// ==================================================

export interface Profile {
  id: number;                         // ID do perfil
  email: string;                      // Email do usuário
  role: "Jogador" | "Clube" | "Olheiro" | "Fã" | "Profissional"; // Role

  nome: string;                       // Nome completo
  bio?: string;                        // Biografia
  profilePictureUrl?: string;          // Avatar
  banner?: string;                     // Banner do perfil
  estatisticas?: number[] | undefined[]; // Estatísticas (placeholder)

  //redes sociais
  whatsapp?: string;                   // WhatsApp
  instagram?: string;                  // Instagram
  twitter?: string;                    // Twitter

  // Aliases / compatibilidade com código antigo
  posicao?: string;                     // alias de posicaoPrincipal
  caracteristicas?: string;             // alias de estiloJogo
  tipoAtuacao?: string[];                 // alias de areaAtuacao
  especializacao?: string | null;       // para clubes/profissionais

  // Campos específicos de jogador
  posicaoPrincipal?: string;            
  posicaoSecundaria?: string;           
  pernaDominante?: "Direita" | "Esquerda" | "Ambas"; 
  dominantFoot?: "Direito" | "Esquerdo" | "Ambidestro" | null; 
  altura?: number;                      
  peso?: number;                        
  idade?: number;                       
  estiloJogo?: string;                  
  referencia?: string;                  
  modalidade?: "Futsal" | "Society" | "Campo"; 

  // Campos para clubes
  historicoClubes?: string;             
  categoria?: string;     
  posicaoProcurada?: string;
  categoriaClube?: string;
  divisao?: string;
  competicoesParticipa?: string; 
  titulos?: string;             

  // Campos para olheiros
  areaAtuacao?: string;                 
  experiencia?: string;  
  clubeOlheiro?: string;                
  nivelAtuacaoOlheiro?: string;      
  
  // Campos para fãs
  time_coracao?: string;                 
  jogador_favorito?: string;

  // Localização
  localizacao?: string;                 
  cidade?: string;                      
  regiao?: string;                      
  atuacao?: string; // Adicionado para lidar com o campo do backend que é uma string JSON.

  // FK
  UserId?: number;                      
}



export interface ProfileResponse {
  success: boolean; // Sucesso
  message: string; // Mensagem
  user: User; // Dados do usuário
  profile: Profile; // Perfil detalhado
}

// ==================================================
// 🔍 Peneiras
// ==================================================

export interface Peneira {
  id: number; // ID
  titulo: string; // Título
  descricao: string; // Descrição
  local: string; // Local do evento
  data_evento: string; // Data ISO
  createdAt: string; // Data de criação
  estado?: string; // Estado
  idade?: string; // Idade mínima
  posicao?: string; // Posição
  detalhes?: string; // Detalhes adicionais
  objetivo?: string; // Objetivo da peneira
}

export interface PeneirasResponse {
  success: boolean; // Sucesso
  message: string; // Mensagem
  peneiras: Peneira[]; // Lista
  total: number; // Total
}

export interface CriarPeneiraPayload {
  titulo: string; // Título
  descricao: string; // Descrição
  local: string; // Local
  data_evento: string; // Data ISO
}

export interface CriarPeneiraResponse {
  success: boolean; // Sucesso
  message: string; // Mensagem
  peneiraId: number; // ID criado
}

// ==================================================
// 📊 Análises
// ==================================================

export interface Analise {
  id: number; // ID
  jogadorId: number; // FK jogador
  nota: number; // Nota
  comentario: string; // Comentário
  createdAt: string; // Data ISO
}

export interface AnalisesResponse {
  success: boolean; // Sucesso
  message: string; // Mensagem
  analises: Analise[]; // Lista
  total: number; // Total
}

// ==================================================
// 🏆 Competições
// ==================================================

export interface Competicao {
  id: number; // ID
  nome: string; // Nome
  descricao: string; // Descrição
  data_inicio: string; // Início ISO
  data_fim: string; // Fim ISO
  clubeId: number; // FK Clube
  createdAt: string; // Criação
}

export interface CompeticoesResponse {
  success: boolean; // Sucesso
  message: string; // Mensagem
  competicoes: Competicao[]; // Lista
  total: number; // Total
}

// ==================================================
// 💳 Planos / Assinaturas / Pagamentos
// ==================================================

export interface Plano {
  id: number; // ID
  nome: string; // Nome
  preco: number; // Preço
  descricao: string; // Descrição
  recursos: string[]; // Recursos inclusos
  duracao: string; // Duração
  ativo: boolean; // Status ativo
}

export interface PlanosResponse {
  success: boolean; // Sucesso
  message: string; // Mensagem
  planos: Plano[]; // Lista
  total: number; // Total
}

export interface Assinatura {
  id: number; // ID
  usuarioId: number; // FK Usuário
  planoId: number; // FK Plano
  status: string; // "Ativa" | "Inativa"
  inicio: string; // Data início
  fim: string; // Data fim
}

export interface AssinaturasResponse {
  success: boolean; // Sucesso
  message: string; // Mensagem
  assinaturas: Assinatura[]; // Lista
  total: number; // Total
}

export interface Pagamento {
  id: number; // ID
  status: string; // Status ("Aprovado", etc.)
  valor: number; // Valor pago
  metodoPagamento: string; // Método (cartão, pix, etc.)
  data: string; // Data ISO
}

export interface PagamentoResponse {
  success: boolean; // Sucesso
  message: string; // Mensagem
  pagamento: Pagamento; // Detalhes
}

// ==================================================
// 🛒 Compras
// ==================================================

export interface Compra {
  id: number; // ID
  planoId: number; // FK Plano
  valor: number; // Valor
  status: string; // "Pendente" | "Aprovado"
  data: string; // Data ISO
}

export interface CompraResponse {
  success: boolean; // Sucesso
  message: string; // Mensagem
  compra: Compra; // Detalhes da compra
}

export interface EfetivacaoCompraResponse {
  success: boolean; // Sucesso
  message: string; // Mensagem
  assinatura: Assinatura; // Assinatura criada
}

// ----------------------------
// 📰 Notícias
// ----------------------------
export interface NewsItem {
  title: string;       // título da notícia
  subtitle?: string;   // subtítulo ou descrição (algumas APIs podem não ter)
  url: string;         // link para a notícia
  image?: string;      // imagem opcional
  publishedAt?: string; // data de publicação opcional
  source?: string;     // nome da fonte opcional
}

