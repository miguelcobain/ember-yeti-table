# Why Yeti Table?

Yeti Table is yet another Ember addon to deal with html tables. There are some good options out there, so why another?

Most table solutions for Ember focus too much on offering many built-in components for things like pagination controls, filtering inputs or column sort indicators. Yeti Table aims to be much more agnostic about markup and behaviour: it gives you all the data, state and actions you need to build whatever UI you want around your tables.

## Features

Yeti Table was built with the needs of a real production app in mind. Out of the box, it supports:

- **Client side row sorting** — on a single column or on multiple columns.
- **Client side row filtering** — you can apply a global filter to the table or just to specific columns.
- **Client side pagination** — provides pagination controls, but encourages you to build your own as well.
- **Server side data** — allows your server to drive the table pagination, filtering and sorting if you choose to. Useful when the dataset is too large to fetch.
- **Customization** — does not provide any styles. You can customize pretty much everything about how the tables are rendered on your templates. This includes custom CSS classes, click handlers and custom filtering and sorting logic.

## Lightweight

Yeti Table currently weighs around **6.17 KiB** (minified and gzipped).

## Why "Yeti"?

A yeti is a mythical creature said to inhabit the Himalayan mountain range. It is large, strong and… a table addon. Sure, why not.
