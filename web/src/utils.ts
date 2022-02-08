export const wait = async (ms: number) =>
  new Promise((res) => setTimeout(res, ms));

// Partially adapted from solid-primatives
/**
 * Creates a method that is throttled and cancellable.
 *
 * @param callback The callback to throttle
 * @param ms The duration to throttle
 * @returns The throttled callback trigger
 *
 * @example
 * ```ts
 * const [trigger, clear] = createThrottle((val) => console.log(val), 250));
 * trigger('my-new-value');
 * ```
 */
export const createThrottle = <
  T extends (...args: any[]) => void,
  A = Parameters<T>,
>(
  func: T,
  ms: number,
): [
  fn: (...args: A extends any[] ? A : never) => void,
  clear: () => void,
] => {
  let lastThrottled = 0;
  return [
    (...args) => {
      const now = Date.now();
      if (now - lastThrottled > ms) {
        func(...args);
        lastThrottled = now;
      }
    },
    () => lastThrottled = 0,
  ];
};
