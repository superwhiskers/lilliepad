import { h, JSX } from 'sinuous'
import { map } from 'sinuous/map'
import { o, subscribe, Observable } from 'sinuous/observable'
import styles from './styles/search.module.css'
import { cls } from '../utils.js'
import type { TabItem } from '../state'
import { Item } from './item'
import { Icon } from './icon'
import Combobox from '@github/combobox-nav'

interface SearchProps {
  results?: Observable<TabItem[]>
  enabled?: Observable<boolean>
}

export const SearchItem = (item: TabItem) => (
  <Item data-key={item.id} name={item.name} icon={item.icon}>
    {item.desc}
  </Item>
)

let unique = 0
export const Search = (props: SearchProps = {}) => {
  const { results = o([]), enabled = o(false) } = props ?? {}

  const enable = () => enabled(true)
  const disable = () => enabled(false)
  const toggle = () => enabled(!enabled())

  let selected = 0
  let combobox: Combobox

  // note: no onblur event to disable search for reasons i don't feel like explaining atm
  const searchInput = (
    <input
      class={styles.searchInput}
      placeholder="Search"
      type="text"
      attrs={{
        role: 'combobox',
        'aria-controls': `list-id-${++unique}`,
      }}
      onFocus={enable}
    />
  ) as HTMLInputElement

  // note: commited out to make debugging easier, 
  //       in the future this should be handled through a debug flag 
  // searchInput.addEventListener('blur', (ev) => {
  //   disable()
  //   return
  // })

  let i = 0
  const searchResults = (
    <ol
      class={styles.searchResults}
      id={`list-id-${unique}`}
      attrs={{ role: 'listbox' }}
    >
      {map(results, (item) => (
        <li
          class={styles.searchResult}
          data-index={i++}
          attrs={{ role: 'option' }}
          onMouseOver={(ev) => {
            combobox.clearSelection()
            ev.currentTarget.setAttribute('aria-selected', 'true')
            combobox.navigate(-1)
            combobox.navigate(1)
          }}
        >
          {SearchItem(item)}
        </li>
      ))}
    </ol>
  )

  // todo(bree): temporary until we (I) make our own.
  // todo: remove combobox
  // note: combobox is used here for performance
  combobox = new Combobox(searchInput, searchResults)

  const search = (
    <div class={() => cls([styles.search, enabled() && styles.enabled])}>
      <div class={styles.header}>
        {searchInput}
        <button
          class={styles.closeButton}
          attrs={{ role: 'button' }}
          onClick={disable}
        >
          <Icon name="x" />
        </button>
      </div>
      {searchResults}
    </div>
  )

  // todo: when escape is pressed the user may just want to stop selecting an item in the combobox, 
  //       or escape the tab trap so that they can tab to the close button (kinda weird I know but idk)  
  window.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') {
      ev.preventDefault()
      disable()
      return
    }

    if (ev.ctrlKey && ev.key === 'p') {
      ev.preventDefault()
      toggle()
      searchInput.focus()
      return
    }
  })

  combobox.start()

  // search.addEventListener('combobox-commit', (ev) =>
  //   console.log(ev.currentTarget)
  // )

  return search
}
