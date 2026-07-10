# `body`

Renders a `<tbody>` and, by default, **iterates the rows for you** — emitting one `<tr>` per row with one `<td>` per visible column. If you pass a block, `body` yields a pre-bound `row` component along with the row data and the row index, and you build the row contents yourself.

Default (auto-iterated) form:

```hbs
<YetiTable @data={{this.data}} as |table|>
  <table.thead as |h|>
    <h.row as |r|>
      <r.column @prop="firstName">First name</r.column>
      <r.column @prop="email">Email</r.column>
    </h.row>
  </table.thead>

  <table.body />
</YetiTable>
```

Custom form (full control):

```hbs
<table.body as |body person index|>
  <body.row as |row|>
    <row.cell>{{index}}</row.cell>
    <row.cell>{{person.firstName}}</row.cell>
    <row.cell>{{person.email}}</row.cell>
  </body.row>
</table.body>
```

## Arguments

| Argument | Type | Description |
| --- | --- | --- |
| `@theme` | `Theme` | Pre-bound. |
| `@data` | `Row[]` | Pre-bound — the processed rows after filtering/sorting/pagination. |
| `@columns` | `ColumnDefinition[]` | Pre-bound. |
| `@onRowClick` | `RowClickHandler` | Called with the row data when a row is clicked. |

## Yielded block

```hbs
<table.body as |body rowData index|>
```

- `body.row` — a [`TBodyRow`](./tbody-row.md) component with `theme`, `onClick`, and `columns` pre-bound.
- `rowData` — the current `Row`.
- `index` — the current row's zero-based index in the visible data set.

When invoked without a block, `body` renders an auto-iterated `<tbody>` and applies `column.prop` to read each cell value.

## Signature

```ts
interface BodySignature {
  Element: HTMLTableSectionElement;
  Args: {
    theme?: Theme;
    data?: Row[];
    columns?: ColumnDefinition[];
    onRowClick?: RowClickHandler;
  };
  Blocks: {
    default: [
      { row: WithBoundArgs<typeof TBodyRow, 'theme' | 'onClick' | 'columns'> },
      Row,
      number,
    ];
  };
}
```
