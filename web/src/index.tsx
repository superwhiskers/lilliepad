import './css'

import { h } from 'sinuous'
import { map } from 'sinuous/map'
import { o, Observable, on } from 'sinuous/observable'

import { Search } from './components/search'
import { Tab } from './components/tab'
import { Fragment } from './components/fragment'
import { InputArea } from './components/input-area'
import { Message } from './components/message'
import { Item } from './components/item'
import styles from './styles/app.module.css'

import type { Message as IMessage } from './types/message'

import { scrollToBottom } from './utils.js'
Fragment // use fragment so it's not removed

import * as state from './state'

state.search.history(
  Array(20)
    .fill(0)
    .map((_, i) => ({
      id: i,
      name: '#general',
      icon: 'https://avatars1.githubusercontent.com/u/10212424',
      desc: 'GeneralChat',
    }))
)

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
  Array(20)
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
  2000
)

// todo: improve perforamnce here
on([messages], () => {
  const scrollBottom = Messages.scrollHeight - Messages.scrollTop - Messages.clientHeight
  const lastElement = Messages.lastElementChild
  if (lastElement) {
    const lastHeight = Messages.lastElementChild?.clientHeight ?? 0
    if (scrollBottom < lastHeight) {
      lastElement.scrollIntoView()
    }
  }
})

const app = (
  <>
    <Search enabled={state.search.enabled} results={state.search.history} />
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
