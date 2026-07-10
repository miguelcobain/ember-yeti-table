# Styling

## No styles included!

**Yeti Table does not include any styles in your app.**

You should think of Yeti Table as your companion when rendering HTML table markup and dealing with the sometimes complex logic of pagination or async data sources.

You are free to use any CSS you want to style your tables. Yeti Table aims to be unopinionated in this matter. Chances are you're already using Bootstrap or Tailwind, for example. Maybe you're using your own custom styles? No problem. Yeti Table should be flexible enough for you to render the markup you need.

## Classes

Yeti Table does provide default classes for you to use at each element of the table as a theme. You may use the class names in the theme as provided or override elements of a theme with your own class names.

Yeti Table's default theme is defined as:

```ts
import type { Theme } from 'ember-yeti-table/types';

const defaultTheme: Theme = {
  table: 'yeti-table',
  row: '',

  thead: '',
  theadRow: '',
  theadCell: '',

  tbody: '',
  tbodyRow: '',
  tbodyCell: '',

  tfoot: '',
  tfootRow: '',
  tfootCell: '',

  sorting: {
    columnSortable: 'yeti-table-sortable',
    columnSorted: 'yeti-table-sorted',
    columnSortedAsc: 'yeti-table-sorted-asc',
    columnSortedDesc: 'yeti-table-sorted-desc',
  },

  pagination: {
    controls: 'yeti-table-pagination-controls',
    info: 'yeti-table-pagination-controls-page-info',
    pageSize: 'yeti-table-pagination-controls-page-size',
    next: 'yeti-table-pagination-controls-next',
    previous: 'yeti-table-pagination-controls-previous',
  },
};

export default defaultTheme;
```

For example, if you wish to override just the `tbodyRow` class you can do the following:

```gts
<YetiTable @theme={{hash tbodyRow="my-new-class"}} @data={{this.data}} @pagination={{true}} as |table|>
  <table.header as |header|>
    ...
  </table.header>

  <table.body as |body user|>
    <body.row as |row|>
      ...
    </body.row>
  </table.body>
</YetiTable>
```

You can see it in action below — odd rows get a soft background via the `docs-themed-row` class:

<CodePreview src="/demos/styling-themed.gts" />

This should provide enough flexibility to customize how Yeti Table renders classes. You can also define a global theme — check out the [Configuration](./configuration) page for more information.

## Examples

The fact that Yeti Table was built with flexibility in mind should give you all the freedom to customize markup to fit the needs of many CSS frameworks like Bootstrap or Tailwind. Usually all it takes is a CSS class here and there.

For example, Bootstrap requires you to add some classes on the table elements. Note that the body row class required a conditional and therefore wasn't overridden in the theme, but could still be specified using the `class` attribute.

Here's an example:

```gts
<YetiTable
  @theme={{hash table="table table-striped table-hover" thead="thead-dark"}}
  @data={{this.data}}
  @pagination={{true}}
  as |table|
>
  <table.header as |header|>
    ...
  </table.header>

  <table.body as |body user|>
    <body.row class={{if user.isActive "table-success"}} as |row|>
      ...
    </body.row>
  </table.body>
</YetiTable>
```

Other CSS utilities follow the same strategy.

## Pagination controls outside the table element

By default, the `<YetiTable>` component renders a `<table>` HTML element. This can be sometimes problematic for some pagination controls because their styling can depend on being rendered outside the `<table>` element.

You can work around this problem by using something like:

```gts
<YetiTable @data={{this.data}} @pagination={{true}} @renderTableElement={{false}} as |t|>
  <t.table>
    <t.header as |header|>
      ...
    </t.header>

    <t.body />
  </t.table>

  <t.pagination /> {{!-- pagination controls outside the <table> element --}}
</YetiTable>
```

Basically we told Yeti Table to not render any element by specifying `@renderTableElement={{false}}` and then we render our own `<table>` element inside using the `<t.table>` component.

Another possible approach (perhaps semantically more interesting?) is to use a full-span cell on the table footer:

```gts
<YetiTable @data={{this.data}} @pagination={{true}} as |table|>
  <table.header as |header|>
    ...
  </table.header>

  <table.body />

  <table.tfoot as |foot|>
    <foot.row as |row|>
      <row.cell colspan={{table.visibleColumns.length}}>
        <table.pagination />
      </row.cell>
    </foot.row>
  </table.tfoot>
</YetiTable>
```

By using `colspan={{table.visibleColumns.length}}` we can make sure that the footer cell always spans across all columns.
