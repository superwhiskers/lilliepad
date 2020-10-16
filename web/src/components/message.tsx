import { h } from 'sinuous'
import styles from './styles/message.module.css'

interface MessageProps {
  // todo: just add a user: User prop
  icon?: string
  displayName?: string
  children?: string
  // todo: allow for time to be omitted
  time: number
}

// todo: maybe use Item for message

export const Message = (props: MessageProps, children: any) => {
  return (
    <article class={styles.message}>
      <div class={styles.user}>
        <img class="icon" src={props.icon} width={24} height={24} />
      </div>
      <div class="flex-1 flex-y">
        <div class={styles.header}>
          <div class={styles.displayName}>{props.displayName}</div>
          <time
            class={styles.time}
            title={`sent ${props.time}`}
            dateTime={new Date(props.time).toISOString()}
          >
            {/* todo: add module for this */}
            just now
          </time>
        </div>
        <main class={styles.main}>{children}</main>
      </div>
    </article>
  )
}
