import './Search.scss'

import { createMemo, createSignal, For, onMount } from "solid-js"
import { ListBoxHandler } from "./controllers/listbox"
import { useRevolt } from './state/revolt'
import { DeepReadonly } from 'solid-js/store'
import { Channel, TextChannel } from './revolt/api/types/channels'
import { Tab } from './components/Tab'
import { NavLink } from 'solid-app-router'
import { Icon } from './components/Icon'

export const $search = document.getElementById('search')!

export const toggleSearch = () => $search.classList.toggle('visible')

export const Search = () => {
  const revolt = useRevolt()

  const allChannels = createMemo(() =>
    Object.values(revolt.state.channels).filter(c => c.channel_type === 'TextChannel') as DeepReadonly<TextChannel>[]
  )

  const $results =
    <ul role="listbox">
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
    <input type="search" placeholder='search threads...' /> as HTMLInputElement

  const listbox = new ListBoxHandler($results)
  listbox.addController($input)
  listbox.addEventListener('select', e => {
    console.log(e.detail.el)
  })

  onMount(() => {
    $input.focus()
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