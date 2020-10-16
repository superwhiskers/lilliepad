export const Fragment = (_: null, ...args: Node[]) => {
  const frag = new DocumentFragment()
  frag.append(...args)
  return frag
}