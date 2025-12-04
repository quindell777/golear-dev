/**
 * @file api.ts
 * @description
 * Instância central do Axios para toda a aplicação GoLear.
 * Permite requisições genéricas com suporte a:
 * - JWT opcional ou customizado
 * - Headers adicionais
 * - BaseURL customizada
 * - Clonagem de instância para chamadas isoladas
 * - Tratamento detalhado de erros para debug
 *
 * @remarks
 * - Baseada em Vite: usa `import.meta.env` para variáveis de ambiente
 * - Possui interceptors de request e response para tratamento global
 */

import axios from "axios"; // import padrão do axios (usado para isAxiosError e criação de instâncias)

/* -------------------------------------------------------------------------- */
/*                             VARIÁVEIS DE AMBIENTE                          */
/* -------------------------------------------------------------------------- */

/**
 * @constant BASE_URL
 * @description URL base da API. Caso não exista no .env, cai no fallback localhost.
 */
const BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || ""; // base da API - pode ser configurada via Vite env

/**
 * @constant INITIAL_JWT
 * @description Token inicial (opcional). NÃO comitar em repositórios públicos.
 * @remarks Só usado como fallback em dev/testing.
 */
const INITIAL_JWT: string = import.meta.env.VITE_JWT || ""; // token de fallback (útil apenas para desenvolvimento)

/* -------------------------------------------------------------------------- */
/*                             INSTÂNCIA BASE DO AXIOS                        */
/* -------------------------------------------------------------------------- */

/**
 * @constant api
 * @description Instância principal do Axios. Pode ser clonada ou usada diretamente.
 */
const api = axios.create({
  baseURL: BASE_URL, // define baseURL para todas as chamadas feitas por 'api'
  headers: {
    "Content-Type": "application/json", // padrão de content-type
  },
});

/* -------------------------------------------------------------------------- */
/*                             GERENCIAMENTO DE TOKEN                         */
/* -------------------------------------------------------------------------- */

/**
 * @function setAuthToken
 * @description Define ou remove o header Authorization globalmente na instância `api`.
 * @param {string | null | undefined} token - JWT a ser usado; passar null/undefined remove o header.
 */
export function setAuthToken(token?: string | null): void {
  if (token) {
    // define Authorization para todas as chamadas feitas com a instância `api`
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    // remove o header Authorization caso token seja falsy
    delete api.defaults.headers.common["Authorization"];
  }
}

// Se houver um token inicial (VITE_JWT) configurado, aplica-o como fallback
if (INITIAL_JWT) {
  setAuthToken(INITIAL_JWT);
}

/* -------------------------------------------------------------------------- */
/*                           INTERCEPTORES GLOBAIS                            */
/* -------------------------------------------------------------------------- */

/**
 * @description Interceptor de requests
 * - Garante Content-Type
 * - Permite log ou manipulação global de headers
 */
api.interceptors.request.use(
  (config) => {
    // Assegura que headers exista (evita erro de leitura)
    config.headers = config.headers ?? {};
    // Se não tiver Content-Type definido, define application/json
    if (!config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }
    // Retorna o config modificado para a requisição prosseguir
    return config;
  },
  (error) => {
    // Erros na criação da requisição (antes de ser enviada)
    console.error("[API REQUEST ERROR]:", error);
    return Promise.reject(error); // repropaga o erro
  }
);

/**
 * @description Interceptor de responses
 * - Se 401, limpa token e pode redirecionar para login
 * - Log detalhado para debug
 */
api.interceptors.response.use(
  (response) => response, // passa resposta adiante sem modificação se OK
  (error: unknown) => {
    // Narrowing seguro: verifica se é erro do Axios
    if (axios.isAxiosError(error)) {
      // Se o servidor retornou resposta com status (ex: 4xx / 5xx)
      if (error.response) {
        console.error("[API RESPONSE ERROR]:", {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
        });

        // Se for 401 (não autorizado), limpa token global e opcionalmente redireciona
        if (error.response.status === 401) {
          setAuthToken(null); // limpa Authorization da instância global
          // window.location.href = "/login"; // descomente se quiser redirect automático
        }
      } else if (error.request) {
        // Requisição foi feita, mas não houve resposta do servidor
        console.error("[API REQUEST MADE, NO RESPONSE]:", error.request);
      } else {
        // Erro ao configurar a requisição antes de enviar
        console.error("[API REQUEST SETUP ERROR]:", error.message);
      }
    } else {
      // Erro que não é do Axios (ex.: erro de lógica local)
      console.error("[API UNKNOWN ERROR]:", error);
    }

    return Promise.reject(error); // repropaga para o chamador lidar
  }
);

/* -------------------------------------------------------------------------- */
/*                           FUNÇÃO FLEXÍVEL DE REQUEST                       */
/* -------------------------------------------------------------------------- */

/**
 * @interface CustomRequestOptions
 * @description Opções flexíveis para requisições via Axios
 * @property url - endpoint ou URL relativo
 * @property method - método HTTP
 * @property data - corpo da requisição (POST/PUT/PATCH)
 * @property params - query params
 * @property withAuth - se true aplica token (pega de storages ou customToken)
 * @property customToken - token específico para essa requisição
 * @property extraHeaders - headers extras para mesclar
 * @property baseURL - substituir baseURL apenas para esta requisição
 */
interface CustomRequestOptions {
  url: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  data?: any;
  params?: Record<string, any>;
  withAuth?: boolean;
  customToken?: string;
  extraHeaders?: Record<string, string>;
  baseURL?: string;
  headers?: Record<string, string>; // permite passar headers diretamente também
}

/**
 * @function request
 * @description Função genérica para realizar requisições HTTP flexíveis
 * @template T - tipo do response.data esperado
 * @param {CustomRequestOptions} options - configurações da requisição
 * @returns {Promise<import("axios").AxiosResponse<T>>} - resposta do axios
 */
export async function request<T = any>(options: CustomRequestOptions) {
  // extrai opções, definindo comportamento padrão (withAuth = true)
  const {
    withAuth = true,
    customToken,
    extraHeaders,
    baseURL,
    ...axiosConfig
  } = options;

  // Cria uma instância clone para não tocar na instância global (`api`)
  const instance = axios.create({
    baseURL: baseURL || api.defaults.baseURL, // usa baseURL custom ou a padrão da instância global
    headers: {
      ...api.defaults.headers, // traz headers padrão (Content-Type etc.)
      ...(extraHeaders ?? {}), // mescla com quaisquer headers extras passados
      ...(axiosConfig.headers ?? {}), // permite headers passados diretamente via options.headers
    },
  });

  // Gerencia token dinamicamente
  if (withAuth) {
    // procura token personalizado ou salvo em storages
    const token =
      customToken ||
      localStorage.getItem("authToken") ||
      sessionStorage.getItem("authToken") ||
      INITIAL_JWT; // fallback de dev (se houver)

    if (token) {
      // aplica Authorization apenas nessa instância clone
      instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  } else {
    // garante que Authorization não será enviado
    delete instance.defaults.headers.common["Authorization"];
  }

  try {
    // força o tipo do config para o tipo do axios para evitar mismatch
    const response = await instance.request<T>(
      axiosConfig as import("axios").AxiosRequestConfig
    );
    return response; // retorna axios response para o chamador
  } catch (error: unknown) {
    // Logs detalhados para ajudar no debug (ia exibir status, request e body)
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error("[CUSTOM REQUEST ERROR - RESPONSE]:", {
          status: error.response.status,
          url: axiosConfig.url,
          method: axiosConfig.method,
          dataSent: axiosConfig.data,
          params: axiosConfig.params,
          responseData: error.response.data,
        });
      } else if (error.request) {
        console.error("[CUSTOM REQUEST ERROR - NO RESPONSE]:", {
          url: axiosConfig.url,
          method: axiosConfig.method,
          request: error.request,
        });
      } else {
        console.error("[CUSTOM REQUEST ERROR - SETUP]:", error.message);
      }
    } else {
      console.error("[CUSTOM REQUEST ERROR - UNKNOWN]:", error);
    }

    // Repropaga o erro para o componente tratar (mantemos o objeto original do axios)
    throw error;
  }
}

/* -------------------------------------------------------------------------- */
/*                                EXPORTAÇÕES                                */
/* -------------------------------------------------------------------------- */

export default api;
