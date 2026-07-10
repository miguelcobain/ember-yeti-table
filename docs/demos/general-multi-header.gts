import Component from '@glimmer/component';
import YetiTable from 'ember-yeti-table/components/yeti-table';
import { peopleMedium } from './data';

export default class GeneralMultiHeader extends Component {
  data = peopleMedium;

  <template>
    <YetiTable @data={{this.data}} as |table|>
      <table.thead as |head|>
        <head.row as |row|>
          <row.column @prop="firstName">First name</row.column>
          <row.column @prop="lastName">Last name</row.column>
          <row.column @prop="points">Points</row.column>
        </head.row>

        <head.row as |row|>
          <row.cell>Additional row on header</row.cell>
          <row.cell>Additional row on header</row.cell>
          <row.cell>Additional row on header</row.cell>
        </head.row>
      </table.thead>

      <table.body />
    </YetiTable>
  </template>
}
