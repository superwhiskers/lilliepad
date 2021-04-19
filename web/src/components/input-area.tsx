import styles from './styles/input-area.module.css'

import { h } from 'sinuous'
import { AutoResizeElement } from '../elements/auto-resize.js'
import { JSX } from 'sinuous'
AutoResizeElement // use so not optimized away

export const TextInput = (props: JSX.HTMLAttributes<HTMLTextAreaElement>) => {
  props = props ?? {}
  const textarea = document.createElement('textarea', { is: 'auto-resize' })
  textarea.className = styles.textInput

  if (props?.class) {
    textarea.className += ` ${props.class}`
  }

  textarea.placeholder = 'Write a message...'
  textarea.rows = 1

  Object.entries(props).forEach(([key, val]) => Reflect.set(textarea, key, val))

  return textarea
}

export const InputArea = () => {
  return (
    <div class={styles.inputArea}>
      <TextInput class="scrollable" />
      <button class="button flex flex-center flex-0">➤</button>
    </div>
  )
}
