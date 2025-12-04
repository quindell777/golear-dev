# Documentação da API - GoLear 

Este documento descreve todos os endpoints da API para a rede social de futebol Golear.

**URL Base:** `http://localhost:3000`
**Status:** ✅ **FUNCIONANDO** - API operacional com banco SQLite real

--

## 🔧 Status da API

### Health Check
- **Endpoint:** `GET /health`
- **Descrição:** Verifica se a API está funcionando corretamente
- **Autenticação:** Nenhuma
- **Resposta de Sucesso (200 OK):**
```json
{
  "status": "ok",
  "message": "GoLear API está funcionando",
  "timestamp": "2025-09-21T02:04:58.230Z",
  "database": "SQLite conectado"
}
```

### Ping
- **Endpoint:** `HEAD /ping`
- **Descrição:** Verifica se a aplicação está online através de uma requisição HEAD.
- **Autenticação:** Nenhuma
- **Resposta de Sucesso (200 OK):**
  - A resposta não contém corpo (body).
  - Contém um cabeçalho `X-Status-Message: app online ainda`.

### Rota Raiz
- **Endpoint:** `GET /`
- **Descrição:** Lista todos os endpoints disponíveis e informações da API
- **Autenticação:** Nenhuma
- **Resposta de Sucesso (200 OK):**
```json
{
  "message": "Bem-vindo à GoLear API",
  "version": "1.0.0",
  "status": "funcionando",
  "database": "SQLite conectado",
  "endpoints": {
    "health": "/health",
    "ping": "/ping",
    "auth": "/auth/login/api, /auth/register/api",
    "posts": "/posts, /posts/feed, /posts/:id/like",
    "feed": "/feed/api",
    "players": "/players/search",
    "profile": "/profile/api",
    "recomendacoes": "/recomendacoes/api",
    "peneiras": "/peneiras/api",
    "analises": "/analises/api",
    "competicoes": "/competicoes/api",
    "planos": "/planos/api",
    "assinaturas": "/assinaturas/api",
    "pagamentos": "/pagamentos/api",
    "compras": "/compra-do-plano/api, /auth/compra/api, /efetivacao-compra/api",
    "senha": "/alterar-senha/api, /resgate-senha/api"
  }
}
```

---

## 🔐 Autenticação

### 1. Registrar Novo Usuário
- **Endpoint:** `POST /auth/register/api`
- **Descrição:** Cria um novo usuário e seu perfil associado (Jogador, Clube ou Olheiro)
- **Autenticação:** Nenhuma
- **Corpo da Requisição (Body):** `JSON`
  - `email` (string, obrigatório): O email para login
  - `password` (string, obrigatório): A senha do usuário
  - `role` (string, obrigatório): O tipo de perfil (`"Jogador"`, `"Clube"`, `"Olheiro"`)
  - `nome` (string, opcional): Nome do usuário
  - `posicao` (string, opcional): Posição do jogador
  - `cidade` (string, opcional): Cidade do clube
  - `regiao` (string, opcional): Região do olheiro

#### Exemplo de Body para `role: "Jogador"`
```json
{
  "email": "jogador@email.com",
  "password": "senha123",
  "role": "Jogador",
  "nome": "João Silva",
  "posicao": "Atacante"
}
```

#### Exemplo de Body para `role: "Clube"`
```json
{
  "email": "clube@email.com",
  "password": "senha123",
  "role": "Clube",
  "nome": "São Paulo FC",
  "cidade": "São Paulo"
}
```

#### Exemplo de Body para `role: "Olheiro"`
```json
{
  "email": "olheiro@email.com",
  "password": "senha123",
  "role": "Olheiro",
  "nome": "João Observador",
  "regiao": "Nordeste"
}
```

- **Resposta de Sucesso (201 Created):**
```json
{
  "success": true,
  "message": "Usuário registrado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "jogador@email.com",
    "role": "Jogador",
    "createdAt": "2025-09-21T02:04:58.230Z"
  }
}
```

### 2. Login de Usuário
- **Endpoint:** `POST /auth/login/api`
- **Descrição:** Autentica um usuário e retorna um token JWT
- **Autenticação:** Nenhuma
- **Corpo da Requisição (Body):** `JSON`
```json
{
  "email": "jogador@email.com",
  "password": "senha123"
}
```
- **Resposta de Sucesso (200 OK):**
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "jogador@email.com",
    "role": "Jogador",
    "createdAt": "2025-09-21T02:04:58.230Z"
  }
}
```

### 3. Resgatar Senha
- **Endpoint:** `POST /resgate-senha/api`
- **Descrição:** Inicia processo de recuperação de senha
- **Autenticação:** Nenhuma
- **Corpo da Requisição (Body):** `JSON`
```json
{
  "email": "jogador@email.com"
}
```
- **Resposta de Sucesso (200 OK):**
```json
{
  "success": true,
  "message": "Email de recuperação enviado com sucesso",
  "token": "token_de_recuperacao_abc123"
}
```

### 4. Alterar Senha
- **Endpoint:** `POST /alterar-senha/api`
- **Descrição:** Altera a senha do usuário
- **Autenticação:** Nenhuma
- **Corpo da Requisição (Body):** `JSON`
```json
{
  "email": "jogador@email.com",
  "novaSenha": "novaSenha123",
  "token": "token_de_recuperacao_abc123"
}
```
- **Resposta de Sucesso (200 OK):**
```json
{
  "success": true,
  "message": "Senha alterada com sucesso"
}
```

---

## 📝 Posts e Feed

### 1. Criar Post
- **Endpoint:** `POST /posts`
- **Descrição:** Cria um novo post
- **Autenticação:** **Obrigatória** (Bearer Token)
- **Corpo da Requisição (Body):** `JSON`
```json
{
  "titulo": "Meu primeiro post",
  "conteudo": "Ótimo dia de treino hoje!"
}
```
- **Resposta de Sucesso (201 Created):**
```json
  {
  "success": true,
  "message": "Post criado com sucesso",
  "post": {
    "id": 1,
    "titulo": "Meu primeiro post",
    "conteudo": "Ótimo dia de treino hoje!",
    "usuarioId": 1,
    "likesCount": 0,
    "createdAt": "2025-09-21T02:04:58.230Z"
  }
}
```

### 2. Curtir um Post
- **Endpoint:** `POST /posts/:id/like`
- **Descrição:** Adiciona um like a um post. O usuário não pode curtir o mesmo post duas vezes.
- **Autenticação:** **Obrigatória** (Bearer Token)
- **Parâmetros da URL:**
  - `id` (integer, obrigatório): O ID do post a ser curtido.
- **Resposta de Sucesso (200 OK):**
```json
{
  "success": true,
  "message": "Post curtido com sucesso"
}
```
- **Resposta de Erro (400 Bad Request):**
```json
{
  "success": false,
  "message": "Você já curtiu este post"
}
```

### 3. Obter Feed Principal
- **Endpoint:** `GET /feed/api`
- **Descrição:** Retorna o feed de posts (últimos 20 posts)
- **Autenticação:** Nenhuma
- **Resposta de Sucesso (200 OK):**
```json
{
  "success": true,
  "message": "Feed carregado com sucesso",
  "posts": [
      {
        "id": 1,
      "titulo": "Meu primeiro post",
      "conteudo": "Ótimo dia de treino hoje!",
      "usuarioId": 1,
      "likesCount": 0,
      "createdAt": "2025-09-21T02:04:58.230Z"
    }
  ],
  "total": 1
}
```

### 4. Listar Todos os Posts
- **Endpoint:** `GET /posts`
- **Descrição:** Lista todos os posts do sistema
- **Autenticação:** Nenhuma
- **Resposta de Sucesso (200 OK):**
```json
{
  "success": true,
  "message": "Posts listados com sucesso",
  "posts": [
      {
        "id": 1,
      "titulo": "Meu primeiro post",
      "conteudo": "Ótimo dia de treino hoje!",
      "usuarioId": 1,
      "likesCount": 0,
      "createdAt": "2025-09-21T02:04:58.230Z"
    }
  ],
  "total": 1
}
```

---

## 👤 Perfis e Usuários

### 1. Obter Perfil
- **Endpoint:** `GET /profile/api`
- **Descrição:** Retorna informações do perfil do usuário logado
- **Autenticação:** **Obrigatória** (Bearer Token)
- **Resposta de Sucesso (200 OK):**
```json
{
  "success": true,
  "message": "Perfil carregado com sucesso",
  "user": {
    "id": 1,
    "email": "jogador@email.com",
    "role": "Jogador",
    "createdAt": "2025-09-21T02:04:58.230Z"
  },
  "profile": {
    "id": 1,
    "nome": "João Silva",
    "posicao": "Atacante",
    "caracteristicas": "{}",
    "historicoClubes": "",
    "UserId": 1
  }
}
```

### 2. Atualizar Foto de Perfil
- **Endpoint:** `PUT /perfil/foto`
- **Descrição:** Permite que um usuário logado adicione ou atualize a URL da sua foto de perfil.
- **Autenticação:** **Obrigatória** (Bearer Token)
- **Corpo da Requisição (Body):** `JSON`
```json
{
  "profilePictureUrl": "https://example.com/path/to/new_image.jpg"
}
```
- **Resposta de Sucesso (200 OK):**
```json
{
  "success": true,
  "message": "Profile picture updated successfully"
}
```
- **Resposta de Erro (400 Bad Request):**
```json
{
  "success": false,
  "message": "profilePictureUrl is required"
}
```

### 3. Buscar Jogadores
- **Endpoint:** `GET /players/search`
- **Descrição:** Busca jogadores com filtros
- **Autenticação:** **Obrigatória** (Bearer Token)
- **Query Parameters:**
  - `nome` (string, opcional): Busca por nome
  - `posicao` (string, opcional): Filtra por posição
  - `caracteristicas` (string, opcional): Busca por características
- **Exemplos:**
  - `GET /players/search?posicao=Atacante`
  - `GET /players/search?nome=João`
- **Resposta de Sucesso (200 OK):**
```json
{
  "success": true,
  "message": "Busca realizada com sucesso",
  "jogadores": [
    {
      "id": 1,
      "nome": "João Silva",
      "posicao": "Atacante",
      "caracteristicas": "{}",
      "historicoClubes": "",
      "UserId": 1
    }
  ],
  "total": 1,
  "filtros": {
    "nome": null,
    "posicao": "Atacante",
    "caracteristicas": null
  }
}
```

### 4. Obter Recomendações de Perfis
- **Endpoint:** `GET /recomendacoes/api`
- **Descrição:** Retorna 5 perfis aleatórios de qualquer tipo (Jogador, Clube ou Olheiro).
- **Autenticação:** Nenhuma
- **Resposta de Sucesso (200 OK):**
```json
{
  "success": true,
  "message": "Recomendações carregadas com sucesso",
  "recommendations": [
    {
      "user": {
        "id": 1,
        "email": "jogador@email.com",
        "role": "Jogador",
        "profilePictureUrl": null
      },
      "profile": {
        "nome": "João Silva",
        "posicao": "Atacante"
      }
    },
    {
      "user": {
        "id": 2,
        "email": "clube@email.com",
        "role": "Clube",
        "profilePictureUrl": null
      },
      "profile": {
        "nome": "São Paulo FC",
        "cidade": "São Paulo"
      }
    }
  ]
}
```

---

## 📰 Notícias

### 1. Buscar Notícias de Futebol
- **Endpoint:** `GET /noticias`
- **Descrição:** Busca notícias de futebol a nível nacional (Brasil) de uma fonte externa (APITube.io).
- **Autenticação:** Nenhuma (a autenticação é feita com a API externa através de uma chave no servidor).
- **Resposta de Sucesso (200 OK):**
```json
{
  "success": true,
  "message": "Notícias de futebol carregadas com sucesso",
  "source": "APITube.io",
  "data": {
    "total_articles": 12345,
    "articles": [
      {
        "title": "Título da Notícia de Futebol",
        "description": "Descrição da notícia...",
        "url": "https://example.com/news/article",
        "source": {
          "name": "Nome da Fonte",
          "domain": "example.com"
        },
        "published_at": "2025-10-02T18:00:00Z"
      }
    ]
  }
}
```
- **Resposta de Erro (500 Internal Server Error):**
```json
{
  "success": false,
  "message": "API token for news service is not configured."
}
```
- **Resposta de Erro (502 Bad Gateway):**
```json
{
  "success": false,
  "message": "Error fetching news from the external provider."
}
```

---

## 🔍 Peneiras

### 1. Listar Peneiras
- **Endpoint:** `GET /peneiras/api`
- **Descrição:** Lista todas as peneiras disponíveis
- **Autenticação:** Nenhuma
- **Resposta de Sucesso (200 OK):**
```json
{
  "success": true,
  "message": "Peneiras listadas com sucesso",
  "peneiras": [
    {
      "id": 1,
      "titulo": "Peneira São Paulo FC",
      "descricao": "Peneira para jogadores de todas as posições",
      "local": "São Paulo - SP",
      "data_evento": "2025-02-15T10:00:00.000Z",
      "createdAt": "2025-09-21T02:04:58.230Z"
    }
  ],
  "total": 1
}
```

### 2. Criar Peneira
- **Endpoint:** `POST /peneiras`
- **Descrição:** Cria uma nova peneira.
- **Autenticação:** **Obrigatória** (Bearer Token)
- **Autorização:** Apenas usuários com a role `Olheiro`.
- **Corpo da Requisição (Body):** `JSON`
```json
{
  "titulo": "Peneira para Goleiros",
  "descricao": "Buscamos goleiros nascidos entre 2005 e 2007.",
  "local": "CT do Clube, São Paulo - SP",
  "data_evento": "2026-01-20T09:00:00.000Z"
}
```
- **Resposta de Sucesso (201 Created):**
```json
{
  "success": true,
  "message": "Peneira criada com sucesso",
  "peneiraId": 2
}
```
- **Resposta de Erro (403 Forbidden):**
```json
{
  "success": false,
  "message": "Forbidden: Insufficient permissions"
}
```

---

## 📊 Análises

### 1. Obter Análises
- **Endpoint:** `GET /analises/api`
- **Descrição:** Lista análises de jogadores
- **Autenticação:** Nenhuma
- **Resposta de Sucesso (200 OK):**
```json
{
  "success": true,
  "message": "Análises listadas com sucesso",
  "analises": [],
  "total": 0
}
```

---

## 🏆 Competições

### 1. Listar Competições
- **Endpoint:** `GET /competicoes/api`
- **Descrição:** Lista todas as competições
- **Autenticação:** Nenhuma
- **Resposta de Sucesso (200 OK):**
```json
{
  "success": true,
  "message": "Competições listadas com sucesso",
  "competicoes": [],
  "total": 0
}
```

### 2. Criar Competição
- **Endpoint:** `POST /competicoes`
- **Descrição:** Cria uma nova competição.
- **Autenticação:** **Obrigatória** (Bearer Token)
- **Autorização:** Apenas usuários com a role `Clube`.
- **Corpo da Requisição (Body):** `JSON`
```json
{
  "nome": "Copa Sub-20 de Verão",
  "descricao": "Torneio amistoso para equipes de base.",
  "data_inicio": "2026-01-15T00:00:00.000Z",
  "data_fim": "2026-02-01T23:59:59.000Z"
}
```
- **Resposta de Sucesso (201 Created):**
```json
{
  "success": true,
  "message": "Competição criada com sucesso",
  "competicaoId": 1
}
```
- **Resposta de Erro (403 Forbidden):**
```json
{
  "success": false,
  "message": "Forbidden: Insufficient permissions"
}
```

---

## 💳 Planos e Assinaturas

### 1. Listar Planos
- **Endpoint:** `GET /planos/api`
- **Descrição:** Lista todos os planos disponíveis
- **Autenticação:** Nenhuma
- **Resposta de Sucesso (200 OK):**
```json
{
  "success": true,
  "message": "Planos listados com sucesso",
  "planos": [
    {
      "id": 1,
      "nome": "Plano Básico",
      "preco": 29.90,
      "descricao": "Acesso básico às funcionalidades",
      "recursos": ["Visualizar peneiras", "Criar perfil", "Buscar jogadores"],
      "duracao": "1 mês",
      "ativo": true
    },
    {
      "id": 2,
      "nome": "Plano Premium",
      "preco": 59.90,
      "descricao": "Acesso completo a todas as funcionalidades",
      "recursos": ["Tudo do básico", "Análises detalhadas", "Contato direto com clubes", "Prioridade em peneiras"],
      "duracao": "1 mês",
      "ativo": true
    }
  ],
  "total": 2
}
```

### 2. Listar Assinaturas
- **Endpoint:** `GET /assinaturas/api`
- **Descrição:** Lista assinaturas dos usuários
- **Autenticação:** Nenhuma
- **Resposta de Sucesso (200 OK):**
```json
{
  "success": true,
  "message": "Assinaturas listadas com sucesso",
  "assinaturas": [],
  "total": 0
}
```

### 3. Processar Pagamento
- **Endpoint:** `POST /pagamentos/api`
- **Descrição:** Processa pagamento de plano
- **Autenticação:** Nenhuma
- **Corpo da Requisição (Body):** `JSON`
```json
{
  "planoId": 1,
  "usuarioId": 1,
  "valor": 29.90,
  "metodoPagamento": "cartao"
}
```
- **Resposta de Sucesso (200 OK):**
```json
{
  "success": true,
  "message": "Pagamento processado com sucesso",
  "pagamento": {
    "id": 1234,
    "status": "Aprovado",
    "valor": 29.90,
    "metodoPagamento": "cartao",
    "data": "2025-09-21T02:04:58.230Z"
  }
}
```

---

## 🛒 Compras

### 1. Iniciar Compra de Plano
- **Endpoint:** `POST /compra-do-plano/api`
- **Descrição:** Inicia processo de compra de um plano
- **Autenticação:** Nenhuma
- **Corpo da Requisição (Body):** `JSON`
```json
{
  "planoId": 1,
  "usuarioId": 1
}
```
- **Resposta de Sucesso (200 OK):**
```json
{
  "success": true,
  "message": "Compra iniciada com sucesso",
  "compra": {
    "id": 1234,
    "planoId": 1,
    "valor": 29.90,
    "status": "Pendente",
    "data": "2025-09-21T02:04:58.230Z"
  }
}
```

### 2. Verificar Pagamento
- **Endpoint:** `POST /auth/compra/api`
- **Descrição:** Verifica status do pagamento
- **Autenticação:** Nenhuma
- **Corpo da Requisição (Body):** `JSON`
```json
{
  "compraId": 1234,
  "status": "aprovado"
}
```
- **Resposta de Sucesso (200 OK):**
```json
{
  "success": true,
  "message": "Pagamento verificado com sucesso",
  "compra": {
    "id": 1234,
    "status": "aprovado",
    "dataVerificacao": "2025-09-21T02:04:58.230Z"
  }
}
```

### 3. Efetivar Compra
- **Endpoint:** `POST /efetivacao-compra/api`
- **Descrição:** Efetiva a compra após confirmação do pagamento
- **Autenticação:** Nenhuma
- **Corpo da Requisição (Body):** `JSON`
```json
{
  "compraId": 1234,
  "usuarioId": 1,
  "planoId": 1
}
```
- **Resposta de Sucesso (200 OK):**
```json
{
  "success": true,
  "message": "Compra efetivada com sucesso",
  "assinatura": {
    "id": 1234,
    "usuarioId": 1,
    "planoId": 1,
    "status": "Ativa",
    "inicio": "2025-09-21T02:04:58.230Z",
    "fim": "2025-10-21T02:04:58.230Z"
  }
}
```

---

## 🔒 Autenticação e Autorização

### Middleware de Autenticação
Para endpoints que requerem autenticação, inclua o token JWT no cabeçalho:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Validação de Dados
Todos os endpoints incluem validação automática:
- Email deve ser válido e único
- Senha é hasheada com bcrypt
- Campos obrigatórios são validados automaticamente
- Tokens JWT são verificados automaticamente

---

## 📝 Códigos de Status HTTP

- **200 OK**: Requisição bem-sucedida
- **201 Created**: Recurso criado com sucesso
- **400 Bad Request**: Dados inválidos na requisição
- **401 Unauthorized**: Token inválido ou ausente
- **403 Forbidden**: Token inválido
- **404 Not Found**: Recurso não encontrado
- **500 Internal Server Error**: Erro interno do servidor

---

## 🗄️ Banco de Dados

A API utiliza **SQLite3 nativo** como banco de dados principal, com as seguintes características:
- **Arquivo**: `database.sqlite` (criado automaticamente)
- **Driver**: sqlite3 nativo (sem ORM)
- **Sincronização**: Tabelas criadas automaticamente na inicialização
- **Timestamps**: Suporte a createdAt automático

### Principais Tabelas:
- **`Users`** - Usuários do sistema (email, senha, role)
- **`Posts`** - Posts do feed (título, conteúdo, usuário)
- **`Jogadores`** - Perfis de jogadores (nome, posição, características)
- **`Peneiras`** - Eventos de peneira (título, descrição, local, data)
- **`Analises`** - Análises de jogadores (estrutura pronta)
- **`Competicoes`** - Competições (estrutura pronta)

### Características do SQLite:
- ✅ **Dados reais** - Não mais dados mockados
- ✅ **Operações CRUD** - Create, Read, Update, Delete funcionais
- ✅ **Transações** - Suporte a transações SQL
- ✅ **Consultas complexas** - Suporte a JOINs e filtros
- ✅ **Performance** - Banco rápido e eficiente

---

## 🚀 Como Usar

### 1. Iniciar o servidor:
```bash
npm start
# ou
node index.js
```

### 2. Testar a conexão:
```bash
curl http://localhost:3000/health
```

### 3. Registrar um usuário:
```bash
curl -X POST http://localhost:3000/auth/register/api \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@email.com","password":"senha123","role":"Jogador","nome":"João Silva","posicao":"Atacante"}'
```

### 4. Fazer login:
```bash
curl -X POST http://localhost:3000/auth/login/api \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@email.com","password":"senha123"}'
```

### 5. Usar o token retornado para acessar endpoints protegidos:
```bash
curl -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  http://localhost:3000/profile/api
```

### 6. Criar um post:
```bash
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{"titulo":"Meu post","conteudo":"Conteúdo do post"}'
```

### 7. Buscar jogadores:
```bash
curl -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  "http://localhost:3000/players/search?posicao=Atacante"
```

---

## 📱 Integração com App Mobile

### Exemplo de uso em JavaScript/React Native:

```javascript
// Configuração da API
const API_BASE_URL = 'http://localhost:3000';

// Função de login
const login = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login/api`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Salvar token no AsyncStorage
      await AsyncStorage.setItem('token', data.token);
      return data.user;
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('Erro no login:', error);
    throw error;
  }
};

// Função para buscar jogadores
const buscarJogadores = async (filtros = {}) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const params = new URLSearchParams(filtros);
    
    const response = await fetch(`${API_BASE_URL}/players/search?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    const data = await response.json();
    return data.jogadores;
  } catch (error) {
    console.error('Erro ao buscar jogadores:', error);
    throw error;
  }
};

// Função para criar post
const criarPost = async (titulo, conteudo) => {
  try {
    const token = await AsyncStorage.getItem('token');
    
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ titulo, conteudo }),
    });
    
    const data = await response.json();
    return data.post;
  } catch (error) {
    console.error('Erro ao criar post:', error);
    throw error;
  }
};
```

---

## 🔧 Deploy no Vercel

A API está preparada para deploy no Vercel:

1. **Arquivo `vercel.json`** configurado
2. **Scripts de build** no `package.json`
3. **Export do app** para Vercel
4. **Variáveis de ambiente** suportadas

### Deploy:
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy para produção
vercel --prod
```

---

## 📞 Suporte

Para dúvidas ou problemas com a API, verifique:

1. ✅ **Servidor rodando** na porta 3000
2. ✅ **Banco SQLite** acessível (`database.sqlite`)
3. ✅ **Dados JSON** no formato correto
4. ✅ **Token JWT** válido para endpoints protegidos
5. ✅ **CORS** configurado para todas as origens

### Status Atual:
- 🟢 **API funcionando** - Todos os endpoints operacionais
- 🟢 **Banco SQLite** - Conectado e sincronizado
- 🟢 **Autenticação** - JWT funcionando
- 🟢 **Dados reais** - Não mais mockados
- 🟢 **Pronto para produção** - Deploy no Vercel configurado

---

**Última atualização:** 21 de Setembro de 2025  
**Versão da API:** 1.0.0  
**Status:** ✅ OPERACIONAL.
