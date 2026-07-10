import Component from '@glimmer/component';
import YetiTable from 'ember-yeti-table/components/yeti-table';
import { peopleSmall } from './data';

export default class SortingSequence extends Component {
  data = peopleSmall;

  <template>
    <YetiTable @data={{this.data}} @sortSequence="desc,asc,unsorted" as |table|>
      <table.header as |header|>
        <header.column @prop="firstName">First name</header.column>
        <header.column @prop="lastName">Last name</header.column>
        <header.column @prop="points">Points</header.column>
      </table.header>

      <table.body />
    </YetiTable>
  </template>
}
