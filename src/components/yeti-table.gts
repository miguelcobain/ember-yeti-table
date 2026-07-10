import { getOwner } from '@ember/application';
import { action, notifyPropertyChange } from '@ember/object';
import { later, schedule, scheduleOnce } from '@ember/runloop';
import { isEmpty, isPresent } from '@ember/utils';
import Component from '@glimmer/component';
import { cached, tracked } from '@glimmer/tracking';
import Helper from '@ember/component/helper';
import type Owner from '@ember/owner';

import merge from 'deepmerge';
import { use } from 'ember-resources';
import { trackedFunction } from 'reactiveweb/function';
import { keepLatest } from 'reactiveweb/keep-latest';
import { dedupeTracked, localCopy } from 'tracked-toolbox';

import { hash } from '@ember/helper';

import DEFAULT_THEME from '../themes/default-theme.ts';
import filterData from '../utils/filtering-utils.ts';
import {
  compareValues,
  mergeSort,
  sortMultiple,
} from '../utils/sorting-utils.ts';

import Table from './yeti-table/table.gts';
import HeaderComponent from './yeti-table/header.gts';
import THead from './yeti-table/thead.gts';
import Body from './yeti-table/body.gts';
import TBody from './yeti-table/tbody.gts';
import TFoot from './yeti-table/tfoot.gts';
import Pagination from './yeti-table/pagination.gts';
import type Column from './yeti-table/thead/row/column.gts';
import type {
  LoadDataParams,
  PaginationData,
  Row,
  RowFilterFunction,
  SortDirection,
  Theme,
} from '../types.ts';
import type { Comparator } from '../utils/sorting-utils.ts';
import type { WithBoundArgs } from '@glint/template';

const TASK_CANCELATION_NAME = 'TaskCancelation';
const didCancel = function (e: unknown): boolean {
  return !!e && (e as { name?: string }).name === TASK_CANCELATION_NAME;
};

function getConfigWithDefault<T>(key: string, defaultValue: T): () => T {
  return function (this: YetiTable): T {
    return (this.config[key] as T | undefined) ?? defaultValue;
  };
}

interface HelperNamed {
  context: YetiTable;
}

interface UpdateTotalRowsSignature {
  Args: { Positional: [number | undefined]; Named: HelperNamed };
  Return: '';
}

class UpdateTotalRows extends Helper<UpdateTotalRowsSignature> {
  compute(positional: [number | undefined], { context }: HelperNamed): '' {
    context.totalRows = positional[0];
    notifyPropertyChange(context, 'normalizedTotalRows');
    notifyPropertyChange(context, 'paginationData');
    return '';
  }
}

interface UpdateFilterSignature {
  Args: { Positional: [string | undefined]; Named: HelperNamed };
  Return: '';
}

class UpdateFilter extends Helper<UpdateFilterSignature> {
  compute(positional: [string | undefined], { context }: HelperNamed): '' {
    context.filter = positional[0] || '';
    return '';
  }
}

interface ProcessedDataSignature {
  Args: {
    Positional: [];
    Named: {
      loadData?: YetiTable['args']['loadData'];
      context: YetiTable;
    };
  };
  Return: '';
}

class ProcessedData extends Helper<ProcessedDataSignature> {
  compute(
    _positional: [],
    {
      loadData,
      context,
    }: {
      loadData?: YetiTable['args']['loadData'];
      context: YetiTable;
    },
  ): '' {
    const data = context.latestData ?? [];

    if (!loadData) {
      context.processData(data);
    } else {
      context.processedData = data;
    }
    return '';
  }
}

export type YetiTableLoadData = (
  params: LoadDataParams,
) => Row[] | Promise<Row[]>;

export interface YetiTableSignature {
  Element: HTMLElement;
  Args: {
    data?: Row[] | Promise<Row[]>;
    loadData?: YetiTableLoadData;
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
  Blocks: {
    default: [
      {
        table: WithBoundArgs<typeof Table, 'theme' | 'parent'>;
        header: WithBoundArgs<
          typeof HeaderComponent,
          | 'columns'
          | 'onColumnClick'
          | 'sortable'
          | 'sortSequence'
          | 'parent'
          | 'theme'
        >;
        thead: WithBoundArgs<
          typeof THead,
          | 'columns'
          | 'onColumnClick'
          | 'sortable'
          | 'sortSequence'
          | 'theme'
          | 'parent'
        >;
        body: WithBoundArgs<typeof Body, 'data' | 'columns' | 'theme'>;
        tbody: WithBoundArgs<typeof TBody, 'data' | 'columns' | 'theme'>;
        tfoot: WithBoundArgs<typeof TFoot, 'columns' | 'theme' | 'parent'>;
        pagination: WithBoundArgs<
          typeof Pagination,
          'disabled' | 'theme' | 'paginationData' | 'paginationActions'
        >;
        actions: YetiTable['publicApi'];
        paginationData: PaginationData;
        isLoading: boolean;
        columns: Column[];
        visibleColumns: Column[];
        rows: Row[] | undefined;
        totalRows: number;
        visibleRows: Row[] | undefined;
        theme: Theme;
      },
    ];
  };
}

export default class YetiTable extends Component<YetiTableSignature> {
  publicApi = {
    previousPage: () => this.previousPage(),
    nextPage: () => this.nextPage(),
    goToPage: (n: number) => this.goToPage(n),
    changePageSize: (n: number | string) => this.changePageSize(n),
    reloadData: () => this.reloadData(),
  };

  @localCopy('args.pagination', getConfigWithDefault('pagination', false))
  pagination!: boolean;

  @localCopy('args.pageSize', getConfigWithDefault('pageSize', 15))
  pageSize!: number;

  @localCopy('args.pageNumber', 1)
  pageNumber!: number;

  totalRows: number | undefined;

  @dedupeTracked
  filter = '';

  @localCopy('args.sortable', getConfigWithDefault('sortable', true))
  sortable!: boolean;

  @localCopy('args.sortFunction', () => sortMultiple)
  sortFunction!: YetiTableSignature['Args']['sortFunction'];

  @localCopy('args.compareFunction', () => compareValues)
  compareFunction!: Comparator;

  @localCopy(
    'args.sortSequence',
    getConfigWithDefault('sortSequence', ['asc', 'desc']),
  )
  sortSequence!: SortDirection[] | string;

  @localCopy(
    'args.ignoreDataChanges',
    getConfigWithDefault('ignoreDataChanges', false),
  )
  ignoreDataChanges!: boolean;

  @localCopy('args.renderTableElement', true)
  renderTableElement!: boolean;

  @cached
  get mergedTheme(): Theme {
    const configTheme = (this.config.theme as Partial<Theme>) || {};
    const localTheme = this.args.theme || {};
    return merge.all([DEFAULT_THEME, configTheme, localTheme]) as Theme;
  }

  @cached
  get visibleColumns(): Column[] {
    return this.columns.filter((c) => c.visible === true);
  }

  config: Record<string, unknown> =
    (
      (
        getOwner(this) as {
          resolveRegistration?: (name: string) => unknown;
        } | null
      )?.resolveRegistration?.('config:environment') as
        | Record<string, Record<string, unknown>>
        | undefined
    )?.['ember-yeti-table'] || {};

  get normalizedTotalRows(): number {
    if (!this.args.loadData) {
      return this.processedDataRows?.length || 0;
    } else {
      if (this.totalRows === undefined) {
        return this.previousResolvedData.length || 0;
      } else {
        return this.totalRows;
      }
    }
  }

  get normalizedRows(): Row[] | undefined {
    if (!this.args.loadData) {
      return this.processedDataRows;
    } else {
      return this.processedData;
    }
  }

  get paginationData(): PaginationData {
    const pageSize = this.pageSize;
    let pageNumber = this.pageNumber;
    const totalRows = this.normalizedTotalRows;
    let isLastPage: boolean | undefined;
    let totalPages: number | undefined;

    if (totalRows) {
      totalPages = Math.ceil(totalRows / pageSize);
      pageNumber = Math.min(pageNumber, totalPages);
      isLastPage = pageNumber === totalPages;
    }

    const isFirstPage = pageNumber === 1;
    const pageStart = (pageNumber - 1) * pageSize + 1;
    let pageEnd = pageStart + pageSize - 1;

    if (totalRows) {
      pageEnd = Math.min(pageEnd, totalRows);
    }

    return {
      pageSize,
      pageNumber,
      pageStart,
      pageEnd,
      isFirstPage,
      isLastPage,
      totalRows,
      totalPages,
    };
  }

  @tracked
  columns: Column[] = [];

  previousResolvedData: Row[] = [];

  @tracked
  processedData: Row[] | undefined;

  @tracked
  processedDataRows: Row[] | undefined;

  resolvedData = trackedFunction(this, async () => {
    let data: Row[] | Promise<Row[]> | undefined = this.args.data;

    if (this.columns.length == 0) {
      if (typeof this.args.loadData === 'function') {
        return this.previousResolvedData;
      }

      return [] as Row[];
    }

    if (typeof this.args.loadData === 'function') {
      const params = this.computeLoadDataParams();

      try {
        data = await this.args.loadData(params);
      } catch (e) {
        console.log(e);

        if (!didCancel(e)) {
          throw e;
        }
      }
    } else if (data && typeof (data as Promise<Row[]>).then === 'function') {
      data = await data;
    }

    if (this.isDestroyed) {
      return;
    }

    const resolved = (data as Row[] | undefined) || [];

    this.previousResolvedData = resolved;

    return resolved;
  });

  @use latestData = keepLatest({
    value: () => this.resolvedData.value ?? [],
    when: () => this.resolvedData.isPending,
  });

  constructor(owner: Owner, args: YetiTableSignature['Args']) {
    super(owner, args);

    if (typeof this.args.registerApi === 'function') {
      // eslint-disable-next-line ember/no-runloop
      scheduleOnce('actions', null, this.args.registerApi, this.publicApi);
    }
  }

  processData(data: Row[]): void {
    const columns = this.columns.filter(
      (c) => c.filterable && isPresent(c.prop),
    );

    const sortableColumns = this.columns.filter((c) => !isEmpty(c.sort));
    const sortings = sortableColumns.map((c) => ({
      prop: c.prop as string,
      direction: c.sort as SortDirection,
    }));

    const filterFunction = this.args.filterFunction;
    const filterUsing = this.args.filterUsing;
    const filter = this.filter;

    const processTheData = (): void => {
      let working = filterData(
        data,
        columns,
        filter,
        filterFunction,
        filterUsing,
      );

      if (sortings.length > 0) {
        working = mergeSort(working, (itemA, itemB) => {
          return this.sortFunction!(
            itemA,
            itemB,
            sortings,
            this.compareFunction,
          );
        });
      }

      this.processedDataRows = working;

      if (this.pagination) {
        const { pageStart, pageEnd } = this.paginationData;
        working = working.slice(pageStart - 1, pageEnd);
      }

      this.processedData = working;
    };

    if (this.ignoreDataChanges) {
      // eslint-disable-next-line ember/no-runloop
      later(processTheData, 0);
    } else {
      processTheData();
    }
  }

  computeLoadDataParams(): LoadDataParams {
    const params: LoadDataParams = {
      sortData: this.columns
        .filter((c) => !isEmpty(c.sort))
        .map((c) => ({ prop: c.prop, direction: c.sort })),
      filterData: {
        filter: this.filter,
        filterUsing: this.args.filterUsing,
        columnFilters: this.columns.map((c) => ({
          prop: c.prop,
          filter: c.filter,
          filterUsing: c.filterUsing,
        })),
      },
    };

    if (this.pagination) {
      params.paginationData = this.paginationData;
    }

    return params;
  }

  paginateData(data: Row[]): Row[] {
    if (this.pagination) {
      const { pageStart, pageEnd } = this.paginationData;
      data = data.slice(pageStart - 1, pageEnd);
    }

    return data;
  }

  @action
  async reloadData(): Promise<unknown> {
    return await this.resolvedData.retry();
  }

  @action
  onColumnSort(column: Column, e: MouseEvent): void {
    if (column.isSorted) {
      let direction: SortDirection | null | undefined = column.sort;
      const sortSequence = column.normalizedSortSequence;
      direction = sortSequence[
        (sortSequence.indexOf(direction as string) + 1) % sortSequence.length
      ] as SortDirection;

      if ((direction as unknown as string) === 'unsorted') {
        direction = null;
      }
      column.sort = direction;

      if (!e.shiftKey) {
        const columns = this.columns.filter((c) => c !== column);
        columns.forEach((c) => (c.sort = null));
      }
    } else {
      const direction = column.normalizedSortSequence[0] as SortDirection;
      column.sort = direction;

      if (!e.shiftKey) {
        const columns = this.columns.filter((c) => c !== column);
        columns.forEach((c) => (c.sort = null));
      }
    }
  }

  @action
  previousPage(): void {
    if (this.pagination) {
      this.pageNumber = Math.max(this.pageNumber - 1, 1);
    }
  }

  @action
  nextPage(): void {
    if (this.pagination) {
      const { isLastPage } = this.paginationData;

      if (!isLastPage) {
        this.pageNumber = this.pageNumber + 1;
      }
    }
  }

  @action
  goToPage(pageNumber: number): void {
    if (this.pagination) {
      const { totalPages } = this.paginationData;
      pageNumber = Math.max(pageNumber, 1);

      if (totalPages) {
        pageNumber = Math.min(pageNumber, totalPages);
      }

      this.pageNumber = pageNumber;
    }
  }

  @action
  changePageSize(pageSize: number | string): void {
    if (this.pagination) {
      this.pageSize = parseInt(String(pageSize));
    }
  }

  registerColumn(column: Column): void {
    // eslint-disable-next-line ember/no-runloop
    schedule('afterRender', this, function (this: YetiTable) {
      if (typeof this.args.isColumnVisible === 'function') {
        column.visible = this.args.isColumnVisible(column);
      }

      if (!this.columns.includes(column)) {
        this.columns = [...this.columns, column];
      }
    });
  }

  unregisterColumn(column: Column): void {
    if (this.columns.includes(column)) {
      this.columns = this.columns.filter((c) => c !== column);
    }
  }

  <template>
    {{#let
      (hash
        table=(component Table theme=this.mergedTheme parent=this)
        header=(component
          HeaderComponent
          columns=this.columns
          onColumnClick=this.onColumnSort
          sortable=this.sortable
          sortSequence=this.sortSequence
          parent=this
          theme=this.mergedTheme
        )
        thead=(component
          THead
          columns=this.columns
          onColumnClick=this.onColumnSort
          sortable=this.sortable
          sortSequence=this.sortSequence
          theme=this.mergedTheme
          parent=this
        )
        body=(component
          Body
          data=this.processedData
          columns=this.columns
          theme=this.mergedTheme
          parent=this
        )
        tbody=(component
          TBody
          data=this.processedData
          columns=this.columns
          theme=this.mergedTheme
          parent=this
        )
        tfoot=(component
          TFoot columns=this.columns theme=this.mergedTheme parent=this
        )
        pagination=(component
          Pagination
          disabled=this.resolvedData.isPending
          theme=this.mergedTheme
          paginationData=this.paginationData
          paginationActions=(hash
            previousPage=this.previousPage
            nextPage=this.nextPage
            goToPage=this.goToPage
            changePageSize=this.changePageSize
          )
        )
        actions=this.publicApi
        paginationData=this.paginationData
        isLoading=this.resolvedData.isPending
        columns=this.columns
        visibleColumns=this.visibleColumns
        rows=this.normalizedRows
        totalRows=this.normalizedTotalRows
        visibleRows=this.processedData
        theme=this.mergedTheme
      )
      as |api|
    }}
      {{UpdateTotalRows @totalRows context=this}}
      {{UpdateFilter @filter context=this}}
      {{ProcessedData loadData=@loadData context=this}}

      {{#if this.renderTableElement}}
        <Table @theme={{this.mergedTheme}} @parent={{this}} ...attributes>
          {{yield api}}
        </Table>
      {{else}}
        {{yield api}}
      {{/if}}

    {{/let}}
  </template>
}
