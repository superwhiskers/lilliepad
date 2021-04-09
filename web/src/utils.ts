/**
 * where every key is a class name and value is a boolean representing if a class should be represented
 */
export const cls = (obj: (boolean | string)[]): string =>
  obj.reduce<string>((res, key) => (key ? `${res} ${key}` : res), "");

export const scrollToBottom = (el: HTMLElement, { max = 50 } = {}) =>
  requestAnimationFrame(() => {
    if (Math.abs(el.scrollHeight - el.scrollTop - el.clientHeight) <= max) {
      // el.scrollTop = el.scrollHeight;
      el.scrollTo(0, el.scrollHeight);
    }
  });
