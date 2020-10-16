import { h } from 'sinuous'
import styles from './styles/item.module.css'

interface ItemProps {
  icon?: string
  name?: string
  tags?: Element[]
  children?: (Element | string)[] | string
}

// todo: static template this
// todo: clean class names/html
// todo: make semantically correct

export const Item = (props: ItemProps, children?: any) => {
  return (
    <article class={styles.item}>
      {props.icon != null ? (
        <div class={styles.icon}>
          <img class="icon" src={props.icon} width={24} height={24} />
        </div>
      ) : null}

      <div class="flex-y">
        <div class="header flex">
          <div class={styles.tags}>
            <span class="name">{props.name}</span>
            {props.tags}
          </div>
        </div>
        <main>{children}</main>
      </div>
    </article>
  )
}
