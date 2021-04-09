import './css'

import { h } from 'sinuous'
import { map } from 'sinuous/map'
import { o, Observable, subscribe } from 'sinuous/observable'

import { Search } from './components/search'
import { Tab } from './components/tab'
import { Fragment } from './components/fragment'
import { InputArea } from './components/input-area'
import { Message } from './components/message'
import { Item } from './components/item'
import styles from './styles/app.module.css'

import { scrollToBottom } from './utils.js'
Fragment // use fragment so it's not removed

import * as state from './state'

// todo: actual state
const searchHistory = o(
  Array(20)
    .fill(0)
    .map((_, i) => (
      <Item
        data-key={i}
        name="#general"
        icon={'https://avatars1.githubusercontent.com/u/10212424'}
      >
        GeneralChat
      </Item>
    ))
)

// todo: move these to a shared types module
interface IUser {
  id: number
  username: string
  avatar_url: string
}

interface IContent {
  text: string
}

interface IMessage {
  id: number
  timestamp: number
  content: IContent
  author: IUser
}

const default_message = (id: number): IMessage => ({
  id: id,
  timestamp: Date.now(),
  content: {
    text: 'Hello world!',
  },
  author: {
    id: 0,
    username: 'bree',
    avatar_url: 'https://avatars1.githubusercontent.com/u/11599528?s=48',
  },
})

const messages: Observable<IMessage[]> = o(
  Array(10)
    .fill(0)
    .map((_, i) => default_message(i))
)
const Messages = (
  <div class={styles.messages}>
    {map(messages, (msg) => (
      <Message
        data-key={msg.id}
        displayName={msg.author.username}
        icon={msg.author.avatar_url}
        time={msg.timestamp}
      >
        {msg.content.text}
      </Message>
    ))}
  </div>
)

setInterval(
  () => messages(messages().concat([default_message(Date.now())])),
  1000
)

subscribe(() => {
  messages()
  scrollToBottom(Messages, {
    max: Messages.lastElementChild?.clientHeight ?? 0 + 50,
  })
})

const app = (
  <>
    <Search enabled={state.search.enabled} results={searchHistory} />
    <nav class={styles.navbar}>
      <Tab name="general" />
      <a
        class={styles.search}
        attrs={{ role: 'button' }}
        onClick={state.search.toggle}
      >
        {/* todo: actual icons maybe */}
        🔎
      </a>
    </nav>
    {Messages}
    <InputArea />
  </>
)

async function main() {
  document.body.append(app)
}

main()
