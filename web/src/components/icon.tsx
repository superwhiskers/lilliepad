import { hs as h } from 'sinuous'

export const Icon = ({ name }: { name: string }) =>
  <svg aria-hidden="true">
    <use href={`/lib/@tabler/icons/tabler-sprite.svg#tabler-${name}`}></use>
  </svg>
