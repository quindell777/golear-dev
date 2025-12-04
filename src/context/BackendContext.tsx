import React, { createContext, useContext, useEffect, useState } from "react"; //import do react junto aos hooks que foram utilizados
import { apiStart } from "../services/apiStart"; //importa o serviço que faz o wake-up/polling da api

// define a forma do objeto que ficará disponível no contexto
interface backendContextType {
    backendReady: boolean; // indica se a api ja foi confirmada como "online" (true) ou não (false)
}

// cria o contexto com valor padrão (backend não pronto)
const BackendContex = createContext<backendContextType>({backendReady: false});

/**
 * 
 * BackendProvider
 * @description
 * Componente Provider que:
 *  - dispara o wake-up inicial da API (chamando wakeUpBackend),
 *  - atualiza um estado global `backendReady` para informar o resto da app,
 *  - opcionalmente inicia um keep-alive (retry periódico) quando em modo de testes.
 * 
 * @param {object} props - props do componente
 * @param {React.ReactNode} props.children - elementos filhos que vão ser renderizados dentro do provider
 * @returns {JSX.Element} o provider que envolve a applicação
 */

export const BackendProvider: React.FC<{ children: React.ReactNode }> =({ children }) =>{
    const [backendReady, setBackendReady] = useState<boolean>(false); // estado local -> vai ser exposto via context

    useEffect(() => {
        // guarda o id do setInterval para poder limpar depois (hot-reload / unmount)
        let intervalId: ReturnType<typeof setInterval> | null = null;

         /**
         * Flag de controle local para habilitar o keep-alive no cliente.
         * - Mantenha como `true` durante testes/QA para reduzir cold-starts enquanto valida.
         * - **Comente ou coloque `false` antes de deploy para produção**, pois a estratégia
         *   de produção deve ser um cron job/função agendada centralizada.
         *
         * Alternativa: ler de variável de ambiente (ex: import.meta.env.VITE_ENABLE_RETRY)
         * para controlar por ambiente sem alterar o código.
         */

        const enableRetry = false; // ✅ Comente ou troque para false antes dos deploys para não correr risco de sobrecarga da api

        //Intervalo para manter o backend vivo (4.5 minutos em ms)
        const keepAliveMs = 4.5*60*1000;

        // função que inicializa o backend: faz a requisição inicial e, se configurado corretamente, inicia o processo para manter o back on
        async function initBackend (){

            const start = Date.now (); //marca o inicio para medir o quanto demorou para o back iniciar
            const isAwake = await apiStart(); // chama o serviço que implementa o polling até confirmar o /health ou timeout (ex: 60s)
            const elapsed = ((Date.now() - start) / 1000).toFixed(2); // calcula tempo gasto em segundos (com duas casas)

            console.log(isAwake ? `✅ Backend acordado em ${elapsed}s` : `⚠️ Falha ao acordar backend após ${elapsed}s`);

            // expõe o resultado para o resto da app via estado/contexto
            setBackendReady(isAwake);

            // se o modo de teste estiver ativo ou seja o retry estiver ativo e o backend ja respondeu.
            if(enableRetry && isAwake) {
                console.log("🔄 [BackendContext] Iniciando keep-alive a cada 4,5 minutos...")

                // setInterval que fará uma chamada leve para verificar se o backend continua online.
                // Note que a chamada aqui é leve (timeout curto) e serve apenas para manter o container quente.
                intervalId = setInterval(() => {
                    // Chamamos novamente o apistart com parametros menores apenas para confirmar que o backend continua respondendo
                    // Aqui usamos valores menores para que a tentativa seja rápida e não segure recursos.
                    apiStart(10000, 2000).then ((ok) => {
                        console.log(ok ? "✅ [BackendContext] API ainda está online" : "⚠️ [BackendContext] API falhou no keep-alive");
                    });
                }, keepAliveMs);
            }
        }

        // dispara a inicialização assim que o provider monta (rodará apenas uma vez por app mount)
        initBackend();

        // cleanup: se o provider desmontar (hot reload local ou unmount), limpamos o intervalo
        return () => {
            if (intervalId){
                 clearInterval(intervalId);
            }
        };
        // [] => roda apenas uma vez ao montar o provider
    }, []);

    // Provider que disponibiliza o estado `backendReady` para toda a aplicação
    return (
        <BackendContex.Provider value={{ backendReady }}>
            { children }
        </BackendContex.Provider>
    )
}

/**
 * useBackend
 *
 * @description
 * Hook simples para acessar o estado do backend armazenado no contexto.
 * Evita ter que importar useContext e BackendContext manualmente nos componentes.
 *
 * @returns {BackendContextType} O contexto com a propriedade `backendReady`.
 */

export function useBackend(): backendContextType {
  return useContext(BackendContex);
}
