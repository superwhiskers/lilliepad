import './styles/Tab.scss'
import { Component, JSX } from 'solid-js'
import { Icon } from './Icon'
import { IconName } from '../types/icons'

type Service = "telegram" | "discord"
type TabProps = JSX.HTMLAttributes<HTMLDivElement> & {
  name: string
  service: Service;
}

export const Tab: Component<TabProps> = (props) => {
  return <div class="Tab" {...props}>
    <Icon class="icon" name={`brand-${props.service}`} size="16" />
    {/* <img class="icon" src={ICONS[props.service]} /> */}
    <div class="tag name truncate-text">{props.name}</div>
    <button class="close" title="Close tab">
      <Icon name="x" size="16" />
    </button>
  </div>
}