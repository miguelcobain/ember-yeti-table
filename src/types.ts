export type SortDirection = 'asc' | 'desc';

export interface Sort {
  prop: string;
  direction: SortDirection;
}

export type FilterFunction = (value: unknown, filterUsing?: unknown) => boolean;

export type RowFilterFunction = (row: Row, filterUsing?: unknown) => boolean;

export type Row = Record<string, unknown>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RowClickHandler = (...args: any[]) => void;

export interface ColumnDefinition {
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

export interface ThemeSorting {
  columnSortable: string;
  columnSorted: string;
  columnSortedAsc: string;
  columnSortedDesc: string;
}

export interface ThemePagination {
  controls: string;
  info: string;
  pageSize: string;
  next: string;
  previous: string;
}

export interface Theme {
  table: string;
  row: string;
  thead: string;
  theadRow: string;
  theadCell: string;
  tbody: string;
  tbodyRow: string;
  tbodyCell: string;
  tfoot: string;
  tfootRow: string;
  tfootCell: string;
  sorting: ThemeSorting;
  pagination: ThemePagination;
}

export interface PaginationData {
  pageSize: number;
  pageNumber: number;
  pageStart: number;
  pageEnd: number;
  isFirstPage: boolean;
  isLastPage?: boolean;
  totalRows?: number;
  totalPages?: number;
}

export interface PaginationActions {
  previousPage: () => void;
  nextPage: () => void;
  goToPage: (page: number) => void;
  changePageSize: (size: number | string) => void;
}

export interface LoadDataParams {
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
