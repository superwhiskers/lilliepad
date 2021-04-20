# Notes
###### these notes need cleanup

# Css containment

Somehow css containment reduces performance in lists, so it should be used sparingly.

Please test all attempts at improving performance.

# Goals

A goal here is to have every major component able to work with just some paremeters on their own, so that they can be used inside of a tab and multiplexed view.

So a channel list could just be a Search component that's limited to the specific group id and searches for channels `group:{ id: $UID }:channels` (psuedo syntax)

## Questions

> How will messages and such be displayed like this?

I suppose there may need to be exposed instances of this typeof itemized component.

Having every message component fetch the contents would be inneficient, and exposing the parameters to a configurable interface might also be hard.

With this in mind we can think about a component and itemized component like so:

(psuedocode, please take this as more of how it could work and not a direct "this is how it will work")

```rs
// the data represented internally
struct Message { text: string }

// the data represented through html
component! {
  Message { text: string } => <html />
}

// the configurable item implementation for Message
impl Item for Message {
  pub guid: guid

  fn from(msg: Self) -> Item<Message> {
    Self { guid: msg.guid }
  }

  fn render(self) -> HTML {
    let message = self.global.messages.get(self.guid)
    html! {
      <Message {..message} />
    }
  }
}
```

# Accessibility

Where possible please use the `*-block-start`, `*-inline-end`, and similar css properties instead of just `padding` for better accessbility if the text direction changes.

# Icons

Currently icons don't have a consistent width/height or anything, I'd like to change this in the future.