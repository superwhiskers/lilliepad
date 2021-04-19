export class AutoResizeElement extends HTMLTextAreaElement {
  autoResize() {
    requestAnimationFrame(() => {
      // todo: avoid `getComputedStyle`, as this causes a document reflow and rerender, which is fairly expensive
      //       https://gist.github.com/paulirish/5d52fb081b3570c81e3a#calling-getcomputedstyle
      const lhpx = getComputedStyle(this).getPropertyValue('line-height')
      const lh = parseInt(lhpx)
      this.style.height = ''
      this.style.height = `${1 + Math.floor(this.scrollHeight / lh) * lh}px`
    })
  }

  connectedCallback() {
    if (this.isConnected) {
      this.autoResize()
      this.addEventListener('input', this, false)
    }
  }

  disconnectedCallback() {
    this.removeEventListener('input', this, false)
  }

  handleEvent(event: Event) {
    if (event.type === 'input') {
      this.autoResize()
    }
  }
}

customElements.define('auto-resize', AutoResizeElement, { extends: 'textarea' })
