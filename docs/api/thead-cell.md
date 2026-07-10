# `thead.row.cell`

A non-column `<th>` yielded from `head.row`. Useful for rendering filter inputs or extra header information that isn't a regular column.

```hbs
<table.thead as |head|>
  <head.row as |row|>
    <row.cell>
      <input
        type="search"
        placeholder="Search last name"
        value={{this.lastNameFilter}}
        {{on "input" (pipe (pick "target.value") (fn (mut this.lastNameFilter)))}}
      />
    </row.cell>
  </head.row>
</table.thead>
```

The `<th>` is only rendered when the corresponding registered column has `visible === true`.

## Arguments

| Argument | Type | Description |
| --- | --- | --- |
| `@class` | `string` | Extra CSS classes on the `<th>`. |
| `@theme` | `Theme` | Pre-bound. |
| `@parent` | `THeadCellParent` | Pre-bound. |
| `@prop` | `string` | Property name to associate this cell with — used to look up the matching column. |

## Yielded block

The default block is yielded with no parameters.

## Signature

```ts
interface THeadCellSignature {
  Element: HTMLTableCellElement;
  Args: {
    class?: string;
    theme?: Theme;
    parent?: THeadCellParent;
    prop?: string;
  };
  Blocks: { default: [] };
}
```
