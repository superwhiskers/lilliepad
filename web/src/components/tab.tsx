import { h } from 'sinuous'
import { Icon } from './icon'

import styles from './styles/tab.module.css'

interface SearchProps {
  name?: string
}

// todo: in future have a border/color/icon indicator to show what service the tab is
// todo: maybe make tabs an Item

export const Tab = (props: SearchProps = {}) => {
  const { name } = props ?? {}
  return (
    <div class={styles.tab}>
      <span class="truncate-text flex-1">{name}</span>
      <button class={styles.close} aria-label="Close"><Icon name="x" /></button>
    </div>
  )
}
