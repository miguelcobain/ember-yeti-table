import Component from '@glimmer/component';
import YetiTable from 'ember-yeti-table/components/yeti-table';
import { peopleMedium } from './data';

export default class GeneralSimple extends Component {
  data = peopleMedium;

  <template>
    <YetiTable @data={{this.data}} as |table|>
      <table.header as |header|>
        <header.column @prop="firstName">First name</header.column>
        <header.column @prop="lastName">Last name</header.column>
        <header.column @prop="points">Points</header.column>
      </table.header>

      <table.body />
    </YetiTable>
  </template>
}
