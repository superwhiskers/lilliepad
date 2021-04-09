import './css'

import { h } from 'sinuous'
import { o, subscribe } from 'sinuous/observable'
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

const DefaultMessage = () => (
  <Message
    displayName="bree"
    icon="https://avatars1.githubusercontent.com/u/11599528?s=48"
    time={Date.now()}
  >
    hello world
  </Message>
)

const messages = o(Array(10).fill(0).map(DefaultMessage))
const Messages = <div class={styles.messages}>{messages}</div>

setInterval(() => messages(messages().concat([DefaultMessage()])), 2000)

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
