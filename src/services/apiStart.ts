import api from './api';
import type { HealthResponse } from '../types/api';

/**
 * Tenta acordar o back-end fazendo polling no endpoint /health.
 * @param maxWait - Tempo máximo de espera em milissegundos.
 * @param interval - Intervalo entre as tentativas.
 * @returns `true` se a API responder, `false` caso contrário.
 */
export async function apiStart(
  maxWait: number = 60000,
  interval: number = 5000
): Promise<boolean> {
  console.log('Iniciando a verificação da API...');

  const startTime = Date.now();

  while (Date.now() - startTime < maxWait) {
    try {
      const response = await api.get<HealthResponse>('/health');

      if (response.status === 200 && response.data.status === 'ok') {
        console.log(
          `✅ Backend respondeu! Status: ${response.data.status}, DB: ${response.data.database}`
        );
        return true;
      }
    } catch (error) {
      // Adicionando o parâmetro 'error' para máxima compatibilidade
      console.log(
        `⚠️ API ainda não respondeu. Tentando novamente em ${interval / 1000}s...`
      );
    }

    // Aguarda o próximo intervalo
    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  console.log(
    '❌ Tempo máximo de espera atingido. O backend pode estar em cold-start ou offline.'
  );
  return false;
}
