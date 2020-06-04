# Why Yeti Table?

Perhaps the biggest difference compared to other table solution is that Yeti Table uses templates to define your columns.
In many other table solutions you need to define columns in JavaScript.
Yeti Table was born from an experimentation of trying to define columns in templates.

In practice, this empowers customization and feels more in line with writing regular HTML tables.
This fact has many implications on the whole API of Yeti Table.

What most people are probably thinking is how Yeti Table compares to the great [Ember Table](https://github.com/Addepar/ember-table) addon.

First of all, let me clarify that Ember Table is **amazing** and in fact Yeti Table borrowed **a lot** of good lessons from it. So, a big thank you to all of its contributors.

At the time of writing, Ember Table still has some more advanced features that Yeti Table doesn't, so you might want to check their excellent documentation site to find out if you need such features. However, Yeti Table also has some nice features that Ember Table hasn't.

Yeti Table was also inspired by [DataTables](https://datatables.net/) in a lot of its features.

## Features

Yeti Table was built with the needs of a real production app in mind. Out of the box, it supports:

- **Client side row sorting** - On a single column or on multiple columns.
- **Client side row filtering** - You can apply a global filter to the table or just to specific columns.
- **Client side pagination** - Provides pagination controls, but encourages you to build your own as well.
- **Server side data** - Allows your server to drive the table pagination, filtering and sorting if you choose to. Useful when the dataset is too large to fetch.
- **Customization** - Does not provide any styles. You can customize pretty much everything about how the tables are rendered on your templates. This includes custom css classes, click handlers and custom filtering and sorting logic.

## Lightweight

Yeti table currently weights around `6.17kb` (minified and gzipped).

## Why "Yeti"?

YETI stands for "Yummy Ember Table Implementation" (let me know if you find better words for the acronym).
I also happen to like the sound of the "Yeti" word and we also have this little guy here:

{{svg-jar "yeti" width="100px"}}
