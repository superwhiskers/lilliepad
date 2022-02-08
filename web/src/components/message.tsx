import './styles/Message.scss'

import { Component, createResource, JSX, Show } from "solid-js"
import { Message as RevoltMessage } from '../revolt/api/types/messages'
import { DeepReadonly } from 'solid-js/store'
import { useRevolt } from '../state/revolt'

import * as ulid from 'ulid'
import { generateDefaultAvatarUrl } from '../revolt/api/users'

type MessageProps = JSX.HTMLAttributes<HTMLDivElement> & {
  message: DeepReadonly<RevoltMessage>
}

const dtf = new Intl.DateTimeFormat([], {
  timeStyle: "short"
})

export const Message: Component<MessageProps> = ({ message, ...divProps }) => {
  const revolt = useRevolt()
  const [author] = createResource(message.author, a => revolt.fetchUser(a))

  const timestamp = ulid.decodeTime(message._id)

  return <div class="Message" {...divProps}>
    <img
      class="avatar"
      src={message.masquerade?.avatar ?? author() ? revolt.getAvatarUrl(author()!) : generateDefaultAvatarUrl(message.author)}
      // intetionally like this to follow the spec.
      // https://html.spec.whatwg.org/multipage/images.html#ancillary-images
      alt=""
      height={20}
      width={20}
      aria-hidden="true"
    />
    <div class="username">{message.masquerade?.name ?? author()?.username}</div>
    <div class="tags">
      <Show when={message.edited != null}>
        <time class="tag" dateTime={new Date(message.edited!.$date).toISOString()}>
          message:edited {dtf.format(new Date(message.edited!.$date))}
        </time>
      </Show>
      <time class="tag" dateTime={new Date(timestamp).toISOString()}>
        {dtf.format(timestamp)}
      </time>
    </div>
    <div class="message-text" textContent={typeof message.content === 'string' ? message.content : message.content.type} />
  </div>
}