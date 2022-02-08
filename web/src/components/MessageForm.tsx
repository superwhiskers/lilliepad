import { JSX } from "solid-js";
import { Component, createSignal, Match, splitProps, Switch } from "solid-js";
import { Icon } from "./Icon";

import './styles/MessageForm.scss'

export function count(text: string, subtext: string) {
  let count: number, index: number

  for (
    count = -1, index = -2;
    index != -1;
    count++, index = text.indexOf(subtext, index + 1)
  );

  return count
}

type SendMessageEvent = {
  message: string
}

export type TextInputProps = Omit<JSX.HTMLAttributes<HTMLFormElement>, 'onSubmit'> & {
  onSubmit?: (event: SendMessageEvent) => void
  disabled?: boolean
}

export const MessageForm: Component<TextInputProps> = (props) => {
  const [lines, setLines] = createSignal(1);
  const [local, other] = splitProps(props, ['onSubmit']);

  let textarea: HTMLTextAreaElement;
  let fileInput: HTMLInputElement;

  function resetForm() {
    textarea.form!.reset();
    setLines(1);
  }

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    const message = textarea.value;

    if (message.trim().length > 0) {
      local.onSubmit?.({ message });
      resetForm();
    }
  }

  function handleKeyDown(e: KeyboardEvent & { currentTarget: HTMLTextAreaElement; }) {
    if (!e.shiftKey && e.key === 'Enter') {
      e.preventDefault();
      e.currentTarget.form!.requestSubmit();
    }
  }

  return <form class="MessageForm" {...other} aria-disabled={props.disabled} onSubmit={handleSubmit}>
    <label class="button upload icon" onClick={() => fileInput.click()} title="Attatch a file">
      <input
        type="file"
        multiple

        class="sr-only"

        ref={fileInput!}
        onInput={console.log}
      />
      <Switch>
        <Match when={!props.disabled}>
          <Icon name="plus" size="1.25rem" />
        </Match>
        <Match when={props.disabled}>
          <Icon name='files-off' size="1.25rem" />
        </Match>
      </Switch>
    </label>
    <textarea
      disabled={props.disabled}
      ref={textarea!}
      wrap="soft"
      class="resize scrollbar"
      style={{ '--lines': lines() }}
      onInput={() => setLines(count(textarea.value, '\n') + 1)}
      onKeyDown={handleKeyDown}
      placeholder={props.disabled ? "You don't have permission to send messages here." : 'Send a message.'} />
    <button class="send icon" type="submit" disabled={props.disabled}>
      <Switch>
        <Match when={!props.disabled}>
          <Icon name="send" size="1.25rem" />
        </Match>
        <Match when={props.disabled}>
          <Icon name='message-circle-off' size="1.25rem" />
        </Match>
      </Switch>
    </button>
  </form>;
};
