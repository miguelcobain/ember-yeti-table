import Controller from '@ember/controller';
import { computed, action } from '@ember-decorators/object';
import { A } from '@ember/array';
import faker from 'faker';

export default class FilteringController extends Controller {
  numberOfRows = 10;

  @computed('numberOfRows')
  get data() {
    return A(Array.from(Array(this.get('numberOfRows')), () => {
      return {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        points: faker.random.number({ min: 0, max: 100 })
      };
    }));
  }

  // BEGIN-SNIPPET filtering-custom.js
  @action
  filterPoints(points, { min, max }) {
    min = parseInt(min);
    max = parseInt(max);

    if ((isNaN(min) && isNaN(max)) ||
        (isNaN(min) && points <= max) ||
        (min <= points && isNaN(max)) ||
        (min <= points && points <= max)) {
      return true;
    }
    return false;
  }
  // END-SNIPPET
}
