import { TypedEventTarget } from "../lib/event_target";

type Events = {
  select: CustomEvent<{ el: Element | null }>;
};

export class ListBoxHandler extends TypedEventTarget<Events> {
  controlHandler = {
    handleKeyboardEvent: (event: KeyboardEvent) => {
      const key = event.key;
      const option = this.selectedElement;

      if (
        key !== "ArrowDown" && key !== "ArrowUp" && key !== "Escape" &&
        key !== "Enter"
      ) {
        return;
      }

      event.preventDefault();

      if (!option) {
        this.updateSelection(this.list.firstElementChild);
        return;
      }

      if (key === "ArrowDown") this.nextSelection(option);
      if (key === "ArrowUp") this.previousSelection(option);
      if (key === "Escape") this.cancelSelection();
      if (key === "Enter") this.submitSelection();
    },

    handlePointerEvent: (event: PointerEvent) => {
      if (event.target instanceof Element) {
        if (event.target.getAttribute("role") !== "option") return;
        this.updateSelection(event.target);
      } else {
        console.warn("Event target is not an element!");
      }
    },

    handleEvent: (event: PointerEvent | KeyboardEvent) => {
      switch (event.type) {
        case "keydown":
          return this.controlHandler.handleKeyboardEvent(
            event as KeyboardEvent,
          );
        case "pointerover":
          return this.controlHandler.handlePointerEvent(
            event as PointerEvent,
          );
        case "pointerdown": {
          event.preventDefault();
          this.controlHandler.handlePointerEvent(
            event as PointerEvent,
          );
          return this.submitSelection();
        }
      }
    },
  };

  constructor(public list: Element) {
    super();
    this.addController(this.list);
    this.updateSelection(this.selectedElement);
    this.list.addEventListener("pointerover", this.controlHandler);
    this.list.addEventListener("pointerdown", this.controlHandler);
  }

  get selectedElement(): Element | null {
    const id = this.list.getAttribute("aria-activedescendant");
    if (id) {
      return document.getElementById(id);
    }
    return null;
  }

  set selectedElement(el) {
    this.selectedElement?.setAttribute("aria-selected", "false");

    if (el) {
      el.setAttribute("aria-selected", "true");
      this.list.setAttribute("aria-activedescendant", el.id);
    } else {
      this.list.removeAttribute("aria-activedescendant");
    }
  }

  addController(controller: EventTarget) {
    controller.addEventListener("keydown", this.controlHandler);
  }

  nextSelection(fromOption = this.selectedElement) {
    this.updateSelection(fromOption?.nextElementSibling ?? fromOption);
  }

  previousSelection(fromOption = this.selectedElement) {
    this.updateSelection(fromOption?.previousElementSibling ?? fromOption);
  }

  cancelSelection() {
    this.selectedElement = null;
  }

  submitSelection() {
    this.dispatchEvent(
      new CustomEvent("select", { detail: { el: this.selectedElement } }),
    );
  }

  updateSelection(option?: Element | null) {
    if (!option) return;
    this.selectedElement = option;
  }
}
