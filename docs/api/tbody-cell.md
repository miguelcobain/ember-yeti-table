# `body.row.cell` / `tbody.row.cell`

Renders a `<td>` in the table body. Only rendered when its corresponding column has `visible === true`.

```hbs
<row.cell>
  {{person.firstName}}
</row.cell>
```

If you defined the column with a `@prop`, the cell yields a hash with that prop so you can do generic rendering:

```hbs
<row.cell as |column|>
  {{get person column.prop}}
</row.cell>
```

## Arguments

| Argument | Type | Description |
| --- | --- | --- |
| `@class` | `string` | Extra CSS classes on the `<td>`. |
| `@theme` | `Theme` | Pre-bound. |
| `@parent` | `TBodyCellParent` | Pre-bound. |
| `@columns` | `ColumnDefinition[]` | Pre-bound — used to resolve the matching column for this cell. |

## Yielded block

```hbs
<row.cell as |column|>
```

- `column.prop` — the `prop` name of the matching column (or `undefined`).

## Signature

```ts
interface TBodyCellSignature {
  Element: HTMLTableCellElement;
  Args: {
    class?: string;
    theme?: Theme;
    parent?: TBodyCellParent;
    columns?: ColumnDefinition[];
  };
  Blocks: { default: [{ prop: string | undefined }] };
}
```
