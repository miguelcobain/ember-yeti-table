# `<YetiTable />`

The root component. Owns the data pipeline (filtering, sorting, pagination, async loading) and yields a hash of sub-components and reactive state.

Renders an `<HTMLElement>` (a `<table>` by default — see `@renderTableElement`).

```hbs
<YetiTable @data={{this.data}} as |table|>
  <table.thead as |head|>
    <head.row as |row|>
      <row.column @prop="firstName">First name</row.column>
      <row.column @prop="lastName">Last name</row.column>
    </head.row>
  </table.thead>

  <table.body />
</YetiTable>
```

## Arguments

| Argument | Type | Default | Description |
| --- | --- | --- | --- |
| `@data` | `Row[] \| Promise<Row[]>` | — | The data the table operates on. Can be a plain array or a `Promise`. |
| `@loadData` | `(params: LoadDataParams) => Row[] \| Promise<Row[]>` | — | Async data hook. When provided, Yeti Table calls it instead of running its in-memory pipeline, and forwards the current sorting/filtering/pagination state. See the [Async data guide](../guide/async.md). |
| `@theme` | `Partial<Theme>` | merged with `DEFAULT_THEME` and config theme | Per-instance theme overrides. |
| `@pagination` | `boolean` | `false` (configurable) | Enable client-side pagination. |
| `@pageSize` | `number` | `15` (configurable) | Rows per page when `@pagination` is on. |
| `@pageNumber` | `number` | `1` | Current page (1-based). |
| `@totalRows` | `number` | — | Total row count. Required when using `@loadData` with `@pagination`. |
| `@filter` | `string` | `''` | Global filter string applied across columns that have a `prop`. |
| `@filterFunction` | `RowFilterFunction` | — | Custom global row filter. |
| `@filterUsing` | `unknown` | — | Free-form extra value passed to `@filterFunction`. |
| `@sortable` | `boolean` | `true` (configurable) | Globally enable/disable sorting. |
| `@sortFunction` | `(a: Row, b: Row, sorts: Sort[], compareFn) => number` | `sortMultiple` | Custom sort algorithm. |
| `@compareFunction` | `Comparator` | `compareValues` | Per-value comparator used by the default sort. |
| `@sortSequence` | `SortDirection[] \| string` | `['asc', 'desc']` (configurable) | Order in which clicking a column cycles through sort directions. Strings are comma-split. |
| `@ignoreDataChanges` | `boolean` | `false` (configurable) | Skip re-running the pipeline when `@data` identity changes. |
| `@renderTableElement` | `boolean` | `true` | When `false`, Yeti Table does not render its own `<table>` and you can use `table.table` yourself. |
| `@isColumnVisible` | `(column: Column) => boolean` | — | Predicate that can hide columns dynamically. |
| `@registerApi` | `(api) => void` | — | Callback that receives the public API (`previousPage`, `nextPage`, `goToPage`, `changePageSize`, `reloadData`). |

## Yielded block

```hbs
<YetiTable ... as |api|>
```

The yielded `api` is a hash with the following shape:

| Key | Type | Description |
| --- | --- | --- |
| `api.table` | `<Table>` (bound) | Renders the `<table>` element. Useful when `@renderTableElement={{false}}`. |
| `api.header` | `<Header>` (bound) | Single-row `<thead>` shortcut. |
| `api.thead` | `<THead>` (bound) | Full-featured `<thead>`. |
| `api.body` | `<Body>` (bound) | `<tbody>` that iterates rows internally. |
| `api.tbody` | `<TBody>` (bound) | `<tbody>` where you iterate rows yourself. |
| `api.tfoot` | `<TFoot>` (bound) | `<tfoot>` section. |
| `api.pagination` | `<Pagination>` (bound) | Bundled pagination UI. |
| `api.actions` | `{ previousPage, nextPage, goToPage, changePageSize, reloadData }` | Imperative actions. |
| `api.paginationData` | `PaginationData` | Current pagination state. |
| `api.isLoading` | `boolean` | `true` while async data is resolving. |
| `api.columns` | `Column[]` | All registered columns. |
| `api.visibleColumns` | `Column[]` | Columns where `visible === true`. |
| `api.rows` | `Row[] \| undefined` | The resolved, unprocessed rows. |
| `api.totalRows` | `number` | Total row count (server- or client-side). |
| `api.visibleRows` | `Row[] \| undefined` | Rows after filtering, sorting and paginating. |
| `api.theme` | `Theme` | The merged theme in effect. |

## Signature

```ts
interface YetiTableSignature {
  Element: HTMLElement;
  Args: {
    data?: Row[] | Promise<Row[]>;
    loadData?: (params: LoadDataParams) => Row[] | Promise<Row[]>;
    theme?: Partial<Theme>;
    pagination?: boolean;
    pageSize?: number;
    pageNumber?: number;
    totalRows?: number;
    filter?: string;
    filterFunction?: RowFilterFunction;
    filterUsing?: unknown;
    sortable?: boolean;
    sortFunction?: (
      itemA: Row,
      itemB: Row,
      sorts: { prop: string; direction: SortDirection }[],
      compareFn: Comparator,
    ) => number;
    compareFunction?: Comparator;
    sortSequence?: SortDirection[] | string;
    ignoreDataChanges?: boolean;
    renderTableElement?: boolean;
    isColumnVisible?: (column: Column) => boolean;
    registerApi?: (api: YetiTable['publicApi']) => void;
  };
  Blocks: { default: [YetiTableApi] };
}
```
