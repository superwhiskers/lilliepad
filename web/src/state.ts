import { o } from 'sinuous/observable'

// temporary
export type TabItem = {
  id: number,
  name: string,
  icon: string,
  desc: string
}

export const search = {
  enabled: o(false),
  history: o<TabItem[]>([]),
  toggle: () => search.enabled(!search.enabled()),
}

// todo: make a lot of the state mixed with wasm or something.