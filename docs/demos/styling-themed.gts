import Component from '@glimmer/component';
import { hash } from '@ember/helper';
import YetiTable from 'ember-yeti-table/components/yeti-table';
import { peopleMedium } from './data';

export default class StylingThemed extends Component {
  data = peopleMedium;

  <template>
    <YetiTable
      @theme={{hash tbodyRow="docs-themed-row"}}
      @data={{this.data}}
      @pagination={{true}}
      @pageSize={{5}}
      as |table|
    >
      <table.header as |header|>
        <header.column @prop="firstName">First name</header.column>
        <header.column @prop="lastName">Last name</header.column>
        <header.column @prop="points">Points</header.column>
      </table.header>

      <table.body />

      <table.tfoot as |foot|>
        <foot.row as |row|>
          <row.cell @visible={{true}} colspan={{table.visibleColumns.length}}>
            <table.pagination />
          </row.cell>
        </foot.row>
      </table.tfoot>
    </YetiTable>

    <style>
      .docs-themed-row:nth-child(odd) {
        background: var(--vp-c-bg-soft);
      }
    </style>
  </template>
}
