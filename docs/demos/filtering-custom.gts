import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';
import { action } from '@ember/object';
import { hash } from '@ember/helper';
import YetiTable from 'ember-yeti-table/components/yeti-table';
import { peopleMedium } from './data';

export default class FilteringCustom extends Component {
  data = peopleMedium;

  @tracked min = 0;
  @tracked max = 100;

  @action
  onMin(e: Event) {
    this.min = Number((e.target as HTMLInputElement).value);
  }
  @action
  onMax(e: Event) {
    this.max = Number((e.target as HTMLInputElement).value);
  }

  @action
  filterPoints(points: number, { min, max }: { min: number; max: number }) {
    const lo = Number(min);
    const hi = Number(max);
    return points >= lo && points <= hi;
  }

  <template>
    <div class="docs-flex docs-justify-end">
      <label>
        Min points:
        <input
          class="docs-input"
          type="number"
          min="0"
          max={{this.max}}
          value={{this.min}}
          {{on "input" this.onMin}}
        />
      </label>
      <label>
        Max points:
        <input
          class="docs-input"
          type="number"
          min={{this.min}}
          max="100"
          value={{this.max}}
          {{on "input" this.onMax}}
        />
      </label>
    </div>

    <YetiTable @data={{this.data}} as |table|>
      <table.header as |header|>
        <header.column @prop="firstName">First name</header.column>
        <header.column @prop="lastName">Last name</header.column>
        <header.column
          @prop="points"
          @filterFunction={{this.filterPoints}}
          @filterUsing={{hash min=this.min max=this.max}}
        >
          Points
        </header.column>
      </table.header>

      <table.body />
    </YetiTable>
  </template>
}
