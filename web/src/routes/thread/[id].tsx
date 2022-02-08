import { useData, useParams } from "solid-app-router"
import { Component, createEffect, createMemo, createResource, createSignal, For, Show } from "solid-js"
import { DeepReadonly } from "solid-js/store"
import { MessageForm } from "../../components/MessageForm"
import { useRevolt } from "../../state/revolt"
import { createThrottle } from "../../utils"
import * as Revolt from '../../revolt/api/types/mod'
import { Message } from "../../components/Message"
import { ChannelPermission } from "../../revolt/api/permissions"
import { sendMessage } from "../../revolt/api/messages"

import './styles/thread.scss'

type MessageListProps = {
  messages?: DeepReadonly<Revolt.messages.Message>[]
}

const MessageList: Component<MessageListProps> = (props) => {
  // todo: thread name
  return <ol aria-label={`Messages in thread`}>
    <For each={props.messages}>
      {(item) => <li><Message message={item} /></li>}
    </For>
  </ol>
}

export default function Thread() {
  const params = useParams<{ id: string }>()
  const revolt = useRevolt()

  const messages = createMemo(() => {
    return revolt.state.messageThreads[params.id]?.map(
      (id) => revolt.state.messages[id]
    );
  });

  const permissions = createMemo(() => {
    return revolt.getPermissions(revolt.state.channels[params.id])
  })

  const [startTyping] = createThrottle(() => revolt.send('BeginTyping', { channel: params.id }), 1500)
  const [isLoading, setIsLoading] = createSignal(true)
  const [canLoadMore, setCanLoadMore] = createSignal(false)

  const loadMore = async () => {
    setIsLoading(true)
    const thread = revolt.state.messageThreads[params.id];
    const count = await revolt.fetchMessages(params.id, { before: thread.at(-1) });
    setCanLoadMore(count >= 50)
    setIsLoading(false)
  }

  const loadInitial = async (id: string) => {
    const count = await revolt.fetchMessages(id, {
      sort: 'Latest',
      include_users: revolt.state.messageThreads[id] == null,
    })
    setCanLoadMore(count >= 50)
    setIsLoading(false)
  }

  createResource(() => params.id, loadInitial)

  return <>
    <div class="Thread msg-container scrollbar">
      <div style={{ flex: 1 }} />
      <MessageList messages={messages()} />
      <Show when={!isLoading() && canLoadMore()}>
        <button onclick={loadMore}>Load more...</button>
      </Show>
    </div>
    <MessageForm
      disabled={!(permissions() & ChannelPermission.SendMessage)}
      onInput={startTyping}
      onSubmit={e => {
        sendMessage(params.id, { content: e.message })
      }} />
  </>
} 