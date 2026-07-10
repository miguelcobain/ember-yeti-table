import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';
import { action } from '@ember/object';
import YetiTable from 'ember-yeti-table/components/yeti-table';
import { peopleMedium } from './data';

export default class FilteringColumn extends Component {
  data = peopleMedium;

  @tracked filterText = '';
  @tracked firstNameFilter = '';
  @tracked lastNameFilter = '';
  @tracked pointsFilter = '';

  @action onGlobal(e: Event) {
    this.filterText = (e.target as HTMLInputElement).value;
  }
  @action onFirstName(e: Event) {
    this.firstNameFilter = (e.target as HTMLInputElement).value;
  }
  @action onLastName(e: Event) {
    this.lastNameFilter = (e.target as HTMLInputElement).value;
  }
  @action onPoints(e: Event) {
    this.pointsFilter = (e.target as HTMLInputElement).value;
  }

  <template>
    <div class="docs-flex docs-justify-end">
      <input
        class="docs-input"
        type="search"
        placeholder="Search..."
        value={{this.filterText}}
        {{on "input" this.onGlobal}}
      />
    </div>

    <YetiTable @data={{this.data}} @filter={{this.filterText}} as |table|>
      <table.thead as |head|>
        <head.row as |row|>
          <row.column @prop="firstName" @filter={{this.firstNameFilter}}>
            First name
          </row.column>
          <row.column @prop="lastName" @filter={{this.lastNameFilter}}>
            Last name
          </row.column>
          <row.column @prop="points" @filter={{this.pointsFilter}}>
            Points
          </row.column>
        </head.row>

        <head.row as |row|>
          <row.cell>
            <input
              class="docs-input"
              type="search"
              placeholder="Filter first name"
              value={{this.firstNameFilter}}
              {{on "input" this.onFirstName}}
            />
          </row.cell>
          <row.cell>
            <input
              class="docs-input"
              type="search"
              placeholder="Filter last name"
              value={{this.lastNameFilter}}
              {{on "input" this.onLastName}}
            />
          </row.cell>
          <row.cell>
            <input
              class="docs-input"
              type="search"
              placeholder="Filter points"
              value={{this.pointsFilter}}
              {{on "input" this.onPoints}}
            />
          </row.cell>
        </head.row>
      </table.thead>

      <table.body />
    </YetiTable>
  </template>
}
