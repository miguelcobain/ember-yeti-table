# `thead.row`

Renders a `<tr>` in the table head and yields both a `column` and a `cell` component. Use `column` to declare a sortable/filterable column. Use `cell` to render plain content (e.g. a per-column filter input).

```hbs
<table.thead as |head|>
  <head.row as |row|>
    <row.column @prop="firstName" as |column|>
      First name
      {{if column.isAscSorted  "(sorted asc)"}}
      {{if column.isDescSorted "(sorted desc)"}}
    </row.column>
  </head.row>

  <head.row as |row|>
    <row.cell>
      <input value={{this.firstNameFilter}} ... />
    </row.cell>
  </head.row>
</table.thead>
```

## Arguments

| Argument | Type | Description |
| --- | --- | --- |
| `@trClass` | `string` | Extra CSS classes for the `<tr>`. |
| `@theme` | `Theme` | Pre-bound. |
| `@sortable` | `boolean` | Pre-bound. |
| `@sortSequence` | `SortDirection[] \| string` | Pre-bound. |
| `@onColumnClick` | `(column: Column, e: MouseEvent) => void` | Pre-bound. |
| `@columns` | `ColumnDefinition[]` | Pre-bound. |
| `@parent` | `ColumnParent` | Pre-bound. |

## Yielded block

```hbs
<head.row as |row|>
```

- `row.column` — a [`Column`](./column.md) component with `sortable`, `sortSequence`, `onClick`, `theme`, and `parent` pre-bound.
- `row.cell` — a [`THeadCell`](./thead-cell.md) component with `theme` and `parent` pre-bound.

## Signature

```ts
interface THeadRowSignature {
  Element: HTMLTableRowElement;
  Args: {
    trClass?: string;
    theme?: Theme;
    sortable?: boolean;
    sortSequence?: SortDirection[] | string;
    onColumnClick?: (column: Column, e: MouseEvent) => void;
    columns: ColumnDefinition[];
    parent?: ColumnParent;
  };
  Blocks: {
    default: [
      {
        column: WithBoundArgs<typeof Column, ...>;
        cell:   WithBoundArgs<typeof Cell,   ...>;
      },
    ];
  };
}
```
