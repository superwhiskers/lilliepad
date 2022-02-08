/* @refresh reload */

import { Portal, render } from "solid-js/web"
import "./index.scss"

import { App } from "./App"
import { Search, toggleSearch } from "./Search"
import { Show, Suspense } from "solid-js"
import { RevoltClientProvider, useRevolt } from './state/revolt'
import { createRenderEffect } from "solid-js"
import { Router } from "solid-app-router"

const $search = document.getElementById("search")!
const $loading = document.getElementById('loading')!

const Root = () => {
  const revolt = useRevolt()

  createRenderEffect(() => {
    if (revolt.state.ready) {
      document.body.classList.remove('loading')
    }
  })

  return <>
    <Show when={revolt.state.ready}>
      <App />
      <Portal mount={$search}>
        <Search />
      </Portal>
    </Show>
    <Portal mount={$loading}>
      <h1 class="logo">[ lilliepad ]</h1>
      <div class="info">Loading...</div>
    </Portal>
  </>
}

render(() => (
  <Router>
    <RevoltClientProvider>
      <Root />
    </RevoltClientProvider>
  </Router>
), document.getElementById("root")!)


window.addEventListener('keydown', event => {
  if (event.ctrlKey && event.key === 'p') {
    event.preventDefault()
    toggleSearch()
  }
})