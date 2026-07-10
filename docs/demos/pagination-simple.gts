import Component from '@glimmer/component';
import YetiTable from 'ember-yeti-table/components/yeti-table';
import { peopleLarge } from './data';

export default class PaginationSimple extends Component {
  data = peopleLarge;

  <template>
    <YetiTable
      @data={{this.data}}
      @pagination={{true}}
      @pageSize={{10}}
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
  </template>
}
