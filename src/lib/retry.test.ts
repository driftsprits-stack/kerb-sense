import { describe, expect, it, vi } from 'vitest';
import { CircuitBreaker, backoffDelay, withRetry } from './retry';

const noSleep = () => Promise.resolve();

describe('backoffDelay', () => {
  it('doubles each attempt', () => {
    expect(backoffDelay(0, 500)).toBe(500);
    expect(backoffDelay(1, 500)).toBe(1000);
    expect(backoffDelay(2, 500)).toBe(2000);
  });
});

describe('withRetry', () => {
  it('returns on the first success', async () => {
    const task = vi.fn().mockResolvedValue('ok');
    await expect(withRetry(task, { sleep: noSleep })).resolves.toBe('ok');
    expect(task).toHaveBeenCalledTimes(1);
  });

  it('retries up to the attempt count with backoff, then throws the last error', async () => {
    const sleep = vi.fn().mockResolvedValue(undefined);
    const task = vi.fn().mockRejectedValue(new Error('down'));
    await expect(withRetry(task, { attempts: 3, baseDelayMs: 10, sleep })).rejects.toThrow('down');
    expect(task).toHaveBeenCalledTimes(3);
    expect(sleep.mock.calls.map((c) => c[0])).toEqual([10, 20]);
  });

  it('succeeds after a failure', async () => {
    const task = vi.fn().mockRejectedValueOnce(new Error('once')).mockResolvedValue('fine');
    await expect(withRetry(task, { sleep: noSleep })).resolves.toBe('fine');
    expect(task).toHaveBeenCalledTimes(2);
  });

  it('wraps a non-Error rejection', async () => {
    const task = vi.fn().mockRejectedValue('text');
    await expect(withRetry(task, { attempts: 1, sleep: noSleep })).rejects.toThrow('The request failed.');
  });

  it('aborts a try that runs past the timeout', async () => {
    vi.useFakeTimers();
    const task = (signal: AbortSignal) =>
      new Promise<string>((_, reject) => {
        signal.addEventListener('abort', () => reject(new Error('aborted')));
      });
    const promise = withRetry(task, { attempts: 1, timeoutMs: 100, sleep: noSleep });
    const assertion = expect(promise).rejects.toThrow('aborted');
    await vi.advanceTimersByTimeAsync(150);
    await assertion;
    vi.useRealTimers();
  });
});

describe('CircuitBreaker', () => {
  it('opens after a failure and refuses later calls', async () => {
    const breaker = new CircuitBreaker();
    const loader = vi.fn().mockRejectedValue(new Error('no'));
    await expect(breaker.run('glb', loader)).rejects.toThrow('no');
    expect(breaker.isOpen('glb')).toBe(true);
    await expect(breaker.run('glb', loader)).rejects.toThrow('not available');
    expect(loader).toHaveBeenCalledTimes(1);
  });

  it('shares one in-flight promise per key', async () => {
    const breaker = new CircuitBreaker();
    let resolve: (v: string) => void = () => {};
    const loader = vi.fn(() => new Promise<string>((r) => (resolve = r)));
    const a = breaker.run('clip', loader);
    const b = breaker.run('clip', loader);
    expect(loader).toHaveBeenCalledTimes(1);
    resolve('done');
    await expect(a).resolves.toBe('done');
    await expect(b).resolves.toBe('done');
    expect(breaker.isOpen('clip')).toBe(false);
  });
});
