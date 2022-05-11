import './styles/Message.scss'

import { Component, createResource, For, JSX, Match, Show, Switch } from "solid-js"
import { Message as RevoltMessage } from '../revolt/api/types/messages'
import { DeepReadonly } from 'solid-js/store'
import { useRevolt } from '../state/revolt'

import * as ulid from 'ulid'
import { generateDefaultAvatarUrl } from '../revolt/api/users'
import { generateAttatchmentUrl } from '../revolt/api/autumn'
import { Enum } from '../revolt/api/types/common'
import { FileMetadata, ImageMetadata, VideoMetadata } from '../revolt/api/types/autumn'

type MessageProps = JSX.HTMLAttributes<HTMLElement> & {
  message: DeepReadonly<RevoltMessage>
}

const dtf = new Intl.DateTimeFormat([], {
  timeStyle: "short"
})

export const Message: Component<MessageProps> = ({ message, ...props }) => {
  const revolt = useRevolt()
  const [author] = createResource(message.author, a => revolt.fetchUser(a))

  const timestamp = ulid.decodeTime(message._id)

  return <article class="Message" {...props}>
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
        <time class="tag" dateTime={new Date(message.edited!).toISOString()}>
          message:edited {dtf.format(new Date(message.edited!))}
        </time>
      </Show>
      <time class="tag" dateTime={new Date(timestamp).toISOString()}>
        {dtf.format(timestamp)}
      </time>
    </div>
    <div class="message-text" textContent={message.content} />
    <Show when={message.embeds}>
      <pre class="embeds">Unable to display embeds</pre>
    </Show>
    <Show when={message.attachments}>
      <div class="attatchments">
        <For each={message.attachments!}>
          {att => {
            // todo: fix this
            const img = (att.metadata as ImageMetadata)
            const vid = (att.metadata as VideoMetadata)
            return (
              <Switch fallback={<pre>Unable to display {att.metadata.type} attatchments</pre>}>
                <Match when={att.metadata.type === "Image"}>
                  <figure className={img.width > img.height ? "img wide" : "img tall"} style={{ '--width': img.width, '--height': img.height }}>
                    <figcaption>{att.filename}</figcaption>
                    <img
                      src={generateAttatchmentUrl(att)}
                      width={img.width}
                      height={img.height}
                    />
                  </figure>
                </Match>
                <Match when={att.metadata.type === "Video"}>
                  <figure className={img.width > img.height ? "video wide" : "video tall"} style={{ '--width': img.width, '--height': img.height }}>
                    <figcaption>{att.filename}</figcaption>
                    <video
                      controls
                      src={generateAttatchmentUrl(att, { width: 720 })}
                      width={img.width}
                      height={img.height}
                    />
                  </figure>
                </Match>
                <Match when={att.metadata.type === "Audio"}>
                  <figure>
                    <figcaption>{att.filename}</figcaption>
                    <audio src={generateAttatchmentUrl(att)} controls />
                  </figure>
                </Match>
              </Switch>
            )
          }}
        </For>
      </div>
    </Show>
  </article>
}