# Loading

When loading, `[ lilliepad　]` (refered to as the logo) should appear with the currently fetching and loading modules being presented below it.
Ex.
```
  [ lilliepad ]
fetching wire.wasm
```
The logo should be similar in display to a heading `h1` element.

Once loaded, the loading screen will fade away very quicky.
It will become completely non-interactive will all interactions passing through it.

# Main View

The main view should display tabs, then messages, then the input area.
The left side should have alignment of the images between the search icon, the avatars, and the upload icon.

## Navigation

At the top there should be a list of tabs and a button / icon of the logo that opens up search.
The list of tabs should display the tags it's using and the currently active tab.
The currently active tab should take priority and be distinguished through size.
Tabs may have an icon associated with them, this icon should be able to be user configured in some way.
When there is not enough room, and if enabled then the tabs will shrink down to just the icon with the X close button appearing where the icon would be on hover.
If there still isn't enough room, the tabs will be scrolled through horizontally to find.

## Message List

tdb.

## Input Area

The input area is dedicated to gathering inputs and data to send as messages.

There should be a button / icon for attatching data.
A small tab-like list of files uploaded should appear above the text input, showing the file size, upload status, and a button / icon to remove it.

The text area should automatically resize with newlines, up to a maximum of 50% screen rounded to line height.
This should idealy include the keyboard space on mobile and similar external areas.

There should be a button / icon for sending the message, idealy for touch oriented devices.

If there is a maximum size of messages, file uploads, or similar limits configured then those should be displayed through a slightly hidden/faded text `3/10`, `2400/2500`.
If it goes over it should change to a more red shade to indicate overflow.

