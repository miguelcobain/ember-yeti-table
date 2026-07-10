# `tbody`

Same role as [`body`](./body.md), but **never** iterates rows for you. It yields the pre-bound `row` component **and** the full data array, so you can iterate using `{{#each}}` yourself. Useful when you need access to the surrounding `{{#each}}` (e.g. for `@key`, named contextual blocks, etc.).

```hbs
<table.tbody as |body data|>
  {{#each data as |person index|}}
    <body.row as |row|>
      <row.cell>{{index}}</row.cell>
      <row.cell>{{person.firstName}}</row.cell>
    </body.row>
  {{/each}}
</table.tbody>
```

## Arguments

| Argument | Type | Description |
| --- | --- | --- |
| `@theme` | `Theme` | Pre-bound. |
| `@data` | `Row[]` | Pre-bound — processed rows. |
| `@columns` | `ColumnDefinition[]` | Pre-bound. |
| `@onRowClick` | `RowClickHandler` | Optional row click handler used by `body.row`. |

## Yielded block

```hbs
<table.tbody as |body data|>
```

- `body.row` — a [`TBodyRow`](./tbody-row.md) component with `theme`, `onClick`, and `columns` pre-bound.
- `data` — the processed rows (`Row[] | undefined`).

## Signature

```ts
interface TBodySignature {
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
      Row[] | undefined,
    ];
  };
}
```
