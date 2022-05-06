import './styles/Icon.scss'
import sprites from '../assets/icons/tabler-sprite.svg'

import { Component, JSX, splitProps } from "solid-js"
import { IconName } from '../types/icons'

type IconProps = JSX.SvgSVGAttributes<SVGSVGElement> & {
  name: IconName
  size?: number | string
}

export const Icon: Component<IconProps> = (props) => {
  const [{ name, size }, others] = splitProps(props, ['name', 'size']);

  // todo: don't import the entire thing
  return (
    <svg class="Icon" aria-hidden="true" width={size} height={size} {...others}>
      <use href={`${sprites}#tabler-${name}`} width="100%" height="100%" />
    </svg>
  )
}