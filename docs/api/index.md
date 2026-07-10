# API Reference

This section documents every component shipped by Yeti Table along with the supporting types from `ember-yeti-table/types`.

Each page lists:

- the **arguments** the component accepts (`@arg`)
- the **default block parameters** the component yields
- the underlying **TypeScript signature**

The pages are derived from the public `*Signature` interfaces in `src/components/yeti-table/**`, so they are always in sync with the actual TypeScript types.

## Components

### Top-level

- [`<YetiTable />`](./yeti-table.md) — the root component

### Sub-components yielded from `<YetiTable />`

- [`table`](./table.md) — renders the `<table>` element
- [`header`](./header.md) — single-row `<thead>` shortcut
- [`thead`](./thead.md) — full `<thead>` with explicit rows
- [`body`](./body.md) — `<tbody>` that iterates rows for you
- [`tbody`](./tbody.md) — `<tbody>` where you iterate rows yourself
- [`tfoot`](./tfoot.md) — `<tfoot>` section
- [`pagination`](./pagination.md) — bundled pagination controls

### Row & cell components

- [`thead.row`](./thead-row.md), [`thead.row.column`](./column.md), [`thead.row.cell`](./thead-cell.md)
- [`tbody.row`](./tbody-row.md), [`tbody.row.cell`](./tbody-cell.md)
- [`tfoot.row`](./tfoot-row.md), [`tfoot.row.cell`](./tfoot-cell.md)

## Shared types

The following types are exported from `ember-yeti-table` and referenced throughout this reference:

```ts
type SortDirection = 'asc' | 'desc';

interface Sort {
  prop: string;
  direction: SortDirection;
}

type FilterFunction    = (value: unknown, filterUsing?: unknown) => boolean;
type RowFilterFunction = (row: Row,      filterUsing?: unknown) => boolean;

type Row = Record<string, unknown>;

type RowClickHandler = (...args: any[]) => void;

interface ColumnDefinition {
  prop?: string;
  filter?: string;
  filterFunction?: FilterFunction;
  filterUsing?: unknown;
  filterable?: boolean;
  sortable?: boolean;
  visible?: boolean;
  sort?: SortDirection | null;
  columnClass?: string;
  name?: string;
}

interface PaginationData {
  pageSize: number;
  pageNumber: number;
  pageStart: number;
  pageEnd: number;
  isFirstPage: boolean;
  isLastPage?: boolean;
  totalRows?: number;
  totalPages?: number;
}

interface PaginationActions {
  previousPage:   () => void;
  nextPage:       () => void;
  goToPage:       (page: number) => void;
  changePageSize: (size: number | string) => void;
}

interface LoadDataParams {
  paginationData?: PaginationData;
  sortData: Array<{
    prop: string | undefined;
    direction: SortDirection | null | undefined;
  }>;
  filterData: {
    filter: string;
    filterUsing: unknown;
    columnFilters: Array<{
      prop: string | undefined;
      filter: string | undefined;
      filterUsing: unknown;
    }>;
  };
}

interface Theme { /* see Styling guide for the full shape */ }
```
