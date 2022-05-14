import './Search.scss'

import { createEffect, createMemo, createSignal, For, onMount } from "solid-js"
import { ListBoxHandler } from "./controllers/listbox"
import { useRevolt } from './state/revolt'
import { DeepReadonly } from 'solid-js/store'
import { Channel, TextChannel } from './revolt/api/types/channels'
import { Tab } from './components/Tab'
import { NavLink } from 'solid-app-router'
import { Icon } from './components/Icon'

export const $search = document.getElementById('search')!
export const enabledSignal = createSignal(false)
const [enabled, setEnabled] = enabledSignal;

export const toggleSearch = () => setEnabled(prev => !prev)

export const Search = () => {
  const revolt = useRevolt()

  const allChannels = createMemo(() =>
    Object.values(revolt.state.channels).filter(c => c.channel_type === 'TextChannel') as DeepReadonly<TextChannel>[]
  )

  const $results =
    <ul role="listbox" id="$search-results">
      <For each={allChannels()}>
        {(ch, i) =>
          <li role="option" id={`listbox-${i()}`} class="item">
            <NavLink href={`/thread/${ch._id}`} >
              {`revolt:${revolt.state.servers[ch.server].name}/${ch.name}`}
            </NavLink>
          </li>
        }
      </For>
    </ul> as HTMLUListElement

  const $input =
    <input type="search" placeholder='search threads...' id="$search-input" aria-controls='$search-results' /> as HTMLInputElement

  const listbox = new ListBoxHandler($results)
  listbox.addController($input)
  listbox.addEventListener('select', e => {
    // TODO: fix hackyish
    // could work as an actual solution if needed but it doesn't feel "right"
    e.detail.el?.querySelector('a')?.click()
    toggleSearch()
  })

  // todo: gauge the accessability of this as teleporting the focus around can cause issues for screenreaders.
  createEffect(() => {
    if (enabled()) {
      $search.classList.add('visible')
      $input.focus()
    } else {
      $search.classList.remove('visible')
    }
  })

  return <div class="Search">
    <header>
      <button class="icon search" title="Search" onClick={toggleSearch}>
        <Icon name="plant-2" size="1.25rem" />
      </button>
      {$input}
    </header>
    {$results}
  </div>
}