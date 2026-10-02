// Fetch with a timeout, exponential backoff and a session circuit breaker.
// Used for the GLB and the clip (WEBSITE-STANDARDS E19, E20, S7).
export interface RetryOptions {
  attempts?: number;
  baseDelayMs?: number;
  timeoutMs?: number;
  /** Injected for tests. */
  sleep?: (ms: number) => Promise<void>;
}

export function backoffDelay(attempt: number, baseDelayMs: number): number {
  return baseDelayMs * 2 ** attempt;
}

const defaultSleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Runs task up to `attempts` times. Each try has its own timeout. */
export async function withRetry<T>(
  task: (signal: AbortSignal) => Promise<T>,
  { attempts = 3, baseDelayMs = 500, timeoutMs = 15000, sleep = defaultSleep }: RetryOptions = {},
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await task(controller.signal);
    } catch (error) {
      lastError = error;
      if (attempt < attempts - 1) await sleep(backoffDelay(attempt, baseDelayMs));
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastError instanceof Error ? lastError : new Error('The request failed.');
}

/**
 * A circuit breaker for one resource. After it opens, nothing retries for
 * the rest of the page session. One breaker per resource key.
 */
export class CircuitBreaker {
  private readonly open = new Set<string>();
  private readonly inFlight = new Map<string, Promise<unknown>>();

  isOpen(key: string): boolean {
    return this.open.has(key);
  }

  /** Runs the loader once per key. A second call while one runs shares the promise. */
  async run<T>(key: string, loader: () => Promise<T>): Promise<T> {
    if (this.open.has(key)) throw new Error(`The resource "${key}" is not available in this session.`);
    const existing = this.inFlight.get(key);
    if (existing) return existing as Promise<T>;
    const promise = loader()
      .catch((error: unknown) => {
        this.open.add(key);
        throw error;
      })
      .finally(() => {
        this.inFlight.delete(key);
      });
    this.inFlight.set(key, promise);
    return promise;
  }
}

export const breaker = new CircuitBreaker();
