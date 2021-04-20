import { hs as h } from 'sinuous'

export const Icon = ({ name }: { name: string }) =>
  <svg aria-hidden="true">
    <use href={`/icons/${name}.svg#${name}`}></use>
  </svg>
