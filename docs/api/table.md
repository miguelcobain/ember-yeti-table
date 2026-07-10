# `table`

Renders the `<table>` element with the active theme's `table` class. Yielded from `<YetiTable />` as `table.table`. Most users only need this when they set `@renderTableElement={{false}}` on `<YetiTable />` to wrap the table themselves.

```hbs
<YetiTable @data={{this.data}} @renderTableElement={{false}} as |t|>
  <t.table>
    <t.thead ... />
    <t.body />
  </t.table>
</YetiTable>
```

Splatted attributes (`...attributes`) are forwarded to the underlying `<table>`.

## Arguments

| Argument | Type | Description |
| --- | --- | --- |
| `@theme` | `Theme` | Theme to use. Pre-bound by the parent. |
| `@parent` | `unknown` | Internal handle to the owning `<YetiTable />`. Pre-bound by the parent. |

## Yielded block

The default block is yielded with no parameters.

## Signature

```ts
interface TableSignature {
  Element: HTMLTableElement;
  Args: {
    theme?: Theme;
    parent?: unknown;
  };
  Blocks: { default: [] };
}
```
