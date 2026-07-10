# `pagination`

A ready-to-use pagination control. Yielded by `<YetiTable />` with `paginationData`, `paginationActions`, `theme`, and `disabled` already bound.

```hbs
<YetiTable @data={{this.data}} @pagination={{true}} as |table|>
  <table.thead ... />
  <table.body />

  <table.pagination
    @pageSizes={{array 10 25 50}}
    @showInfo={{true}}
    @showButtons={{true}}
    @showPageSizeSelector={{true}}
  />
</YetiTable>
```

## Arguments

| Argument | Type | Default | Description |
| --- | --- | --- | --- |
| `@theme` | `Theme` | — | Pre-bound. |
| `@paginationData` | `PaginationData` | — | Pre-bound — the current pagination state. |
| `@paginationActions` | `PaginationActions` | — | Pre-bound — `previousPage`, `nextPage`, `goToPage`, `changePageSize`. |
| `@disabled` | `boolean` | — | Pre-bound — `true` while async data is loading. Also disables the previous/next buttons. |
| `@pageSizes` | `number[]` | `[10, 15, 20, 25]` | Page-size options in the page-size selector. |
| `@showInfo` | `boolean` | `true` | Show the "Showing X to Y of Z" info text. |
| `@showPageSizeSelector` | `boolean` | `true` | Show the page-size `<select>`. |
| `@showButtons` | `boolean` | `true` | Show the previous/next buttons. |

## Yielded block

The default block is yielded with no parameters. Splatted attributes are forwarded to the wrapping `<div>`.

## Signature

```ts
interface PaginationSignature {
  Element: HTMLDivElement;
  Args: {
    theme?: Theme;
    paginationData: PaginationData;
    paginationActions: PaginationActions;
    disabled?: boolean;
    pageSizes?: number[];
    showInfo?: boolean;
    showPageSizeSelector?: boolean;
    showButtons?: boolean;
  };
  Blocks: { default: [] };
}
```
