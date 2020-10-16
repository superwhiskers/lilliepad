import './css'

import { h, o } from 'sinuous'
import { Search } from './components/search'
import { Tab } from './components/tab'
import { Fragment } from './components/fragment'
import { InputArea } from './components/input-area'
import { Message } from './components/message'
import { Item } from './components/item'
import styles from './styles/app.module.css'
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

const messages = o(
  Array(10)
    .fill(0)
    .map(() => (
      <Message
        displayName="bree"
        icon="https://avatars1.githubusercontent.com/u/11599528?s=48"
        time={Date.now()}
      >
        hello world
      </Message>
    ))
)

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
    <div class={styles.messages}>{messages}</div>
    <InputArea />
  </>
)

async function main() {
  document.body.append(app)
}

main()
