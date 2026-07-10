import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';
import { action } from '@ember/object';
import YetiTable from 'ember-yeti-table/components/yeti-table';
import { peopleMedium } from './data';

export default class FilteringGlobal extends Component {
  data = peopleMedium;

  @tracked filterText = '';

  @action
  onInput(event: Event) {
    this.filterText = (event.target as HTMLInputElement).value;
  }

  <template>
    <div class="docs-flex docs-justify-end">
      <input
        class="docs-input"
        type="search"
        placeholder="Search..."
        value={{this.filterText}}
        {{on "input" this.onInput}}
      />
    </div>

    <YetiTable @data={{this.data}} @filter={{this.filterText}} as |table|>
      <table.header as |header|>
        <header.column @prop="firstName">First name</header.column>
        <header.column @prop="lastName">Last name</header.column>
        <header.column @prop="points">Points</header.column>
      </table.header>

      <table.body />
    </YetiTable>
  </template>
}
