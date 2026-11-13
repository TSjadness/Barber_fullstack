import { isTransient } from "./errors";

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Repete a chamada em falhas passageiras (espera crescente: ~0,4 s, ~0,9 s). */
export async function withRetry<T>(run: () => Promise<T>, retries: number): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await run();
    } catch (e) {
      if (attempt >= retries || !isTransient(e)) throw e;
      await sleep(400 * 2 ** attempt + Math.random() * 150);
    }
  }
}
