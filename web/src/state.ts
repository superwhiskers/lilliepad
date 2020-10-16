import { o } from 'sinuous/observable'

export const search = {
  enabled: o(false),
  toggle: () => search.enabled(!search.enabled()),
}

// todo: make a lot of the state mixed with wasm or something.