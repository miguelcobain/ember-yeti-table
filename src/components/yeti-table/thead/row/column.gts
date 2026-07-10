import { action } from '@ember/object';
import { assert } from '@ember/debug';

import Component from '@glimmer/component';
import { modifier } from 'ember-modifier';
import { localCopy } from 'tracked-toolbox';
import type Owner from '@ember/owner';

import { on } from '@ember/modifier';
import { hash } from '@ember/helper';

import type {
  ColumnDefinition,
  FilterFunction,
  SortDirection,
  Theme,
} from '../../../../types.ts';

/**
  An important component yielded from the header or head.row component that is used to define
  a column of the table.

  @class Column
*/

export interface ColumnParent {
  registerColumn(column: Column): void;
  unregisterColumn(column: Column): void;
}

export interface ColumnSignature {
  Element: HTMLTableCellElement;
  Args: {
    class?: string;
    theme?: Theme;
    prop?: string;
    visible?: boolean;
    sortable?: boolean;
    sort?: SortDirection | null;
    sortSequence?: SortDirection[] | string;
    filterable?: boolean;
    filter?: string;
    filterFunction?: FilterFunction;
    filterUsing?: unknown;
    columnClass?: string;
    name?: string;
    onClick?: (column: Column, e: MouseEvent) => void;
    parent?: ColumnParent;
  };
  Blocks: {
    default: [
      {
        isSorted: boolean;
        isAscSorted: boolean;
        isDescSorted: boolean;
      },
    ];
  };
}

export default class Column
  extends Component<ColumnSignature>
  implements ColumnDefinition
{
  get prop(): string | undefined {
    return this.args.prop;
  }

  @localCopy('args.visible', true)
  visible!: boolean;

  @localCopy('args.sortable', true)
  sortable!: boolean;

  @localCopy('args.sort')
  sort: SortDirection | null | undefined;

  @localCopy('args.filterable', true)
  filterable!: boolean;

  get filter(): string | undefined {
    return this.args.filter;
  }

  get filterFunction(): FilterFunction | undefined {
    return this.args.filterFunction;
  }

  get filterUsing(): unknown {
    return this.args.filterUsing;
  }

  get columnClass(): string | undefined {
    return this.args.columnClass;
  }

  @localCopy('args.name')
  name: string | undefined;

  get isAscSorted(): boolean {
    return this.sort === 'asc';
  }

  get isDescSorted(): boolean {
    return this.sort === 'desc';
  }

  get isSorted(): boolean {
    return this.isAscSorted || this.isDescSorted;
  }

  get normalizedSortSequence(): string[] {
    const sortSequence = this.args.sortSequence;
    assert(
      '@sortSequence must be either a comma-separated string or an array. Got `${sortSequence}.`',
      Array.isArray(sortSequence) || typeof sortSequence === 'string',
    );

    if (Array.isArray(sortSequence)) {
      return sortSequence;
    } else if (typeof sortSequence === 'string') {
      return sortSequence.split(',').map((s: string) => s.trim());
    } else {
      return [];
    }
  }

  constructor(owner: Owner, args: ColumnSignature['Args']) {
    super(owner, args);

    this.args.parent?.registerColumn(this);
  }

  willDestroy(): void {
    super.willDestroy();
    this.args.parent?.unregisterColumn(this);
  }

  updateName = modifier((element: Element) => {
    if (!this.args.name) {
      this.name = element.textContent?.trim();
    }
  });

  @action
  handleClick(e: MouseEvent): void {
    if (this.sortable && this.args.onClick) {
      this.args.onClick(this, e);
    }
  }

  <template>
    {{! template-lint-disable no-invalid-interactive }}
    {{#if this.visible}}
      <th
        role={{if this.sortable "button"}}
        class="{{@class}}
          {{@theme.theadCell}}
          {{if this.sortable @theme.sorting.columnSortable}}
          {{if this.isSorted @theme.sorting.columnSorted}}
          {{if this.isAscSorted @theme.sorting.columnSortedAsc}}
          {{if this.isDescSorted @theme.sorting.columnSortedDesc}}"
        {{on "click" this.handleClick}}
        {{this.updateName}}
        ...attributes
      >
        {{yield
          (hash
            isSorted=this.isSorted
            isAscSorted=this.isAscSorted
            isDescSorted=this.isDescSorted
          )
        }}
      </th>
    {{/if}}
  </template>
}
