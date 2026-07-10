import Component from '@glimmer/component';
import YetiTable from 'ember-yeti-table/components/yeti-table';
import { advancedSortingData } from './data';

export default class SortingAdvanced extends Component {
  data = advancedSortingData;

  <template>
    <YetiTable @data={{this.data}} as |table|>
      <table.header as |header|>
        <header.column @prop="firstName" @sort="asc">First name</header.column>
        <header.column @prop="lastName" @sort="desc">Last name</header.column>
        <header.column @prop="points">Points</header.column>
      </table.header>

      <table.body />
    </YetiTable>
  </template>
}
