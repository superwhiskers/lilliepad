export class AutoResizeElement extends HTMLTextAreaElement {
  autoResize() {
    requestAnimationFrame(() => {
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
