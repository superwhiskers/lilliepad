import { h } from 'sinuous'
import styles from './styles/message.module.css'
import { timeAgo } from '../utils/time_ago'

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
        <img class="icon" src={props.icon} width={24} height={24} alt={`${props.displayName}'s avatar`} />
      </div>
      <div class="flex-1 flex-y">
        <div class={styles.header}>
          <div class={styles.displayName}>{props.displayName}</div>
          <time
            class={styles.time}
            title={`sent ${props.time}`}
            dateTime={new Date(props.time).toISOString()}
          >
            {timeAgo(props.time)}
          </time>
        </div>
        <main class={styles.main}>{children}</main>
      </div>
    </article>
  )
}
