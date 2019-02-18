# Configuration

You can define some global Yeti table options in your `config/environment.js` file.
This allows you to avoid repetition when writing your Yeti tables.

## Global `theme`

Yeti table looks for theme definitions on your `config/environment.js` file. To do that, you must define
a theme object with the `theme` key inside an `ember-yeti-table` object. Here is an example:

```js
// config/environment.js
let ENV = {
  // ...
  'ember-yeti-table': {
    theme: {
      table: 'my-custom-table-class',
      sorting: {
        columnSortable:  'my-custom-table-sortable-class',
        columnSorted: 'my-custom-table-sorted-class',
        columnSortedAsc: 'my-custom-table-sorted-asc-class',
        columnSortedDesc: 'my-custom-table-sorted-desc-class',
      }
      // provide any other css class name overrides
    }
  }
};
```

There are multiple ways you can customize themes and Yeti table deep merges all of them in a particular order.
This means that you can override classes in any of the following ways (last wins):

- Yeti table default theme
- global theme defined in `config/environment.js`
- `@theme` argument passed to `YetiTable`


## Other options

There are other options you can define globally. Here is an example of defining such options:

```js
// config/environment.js
let ENV = {
  // ...
  'ember-yeti-table': {
    pagination: true,
    pageSize: 30,
    sortable: false,
    sortSequence: ['asc', 'desc', 'unsorted']
  }
};
```
