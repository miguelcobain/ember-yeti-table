import Controller from '@ember/controller';
import { computed } from '@ember-decorators/object';
import { A } from '@ember/array';
import faker from 'faker';

export default class SortingController extends Controller {
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

  @computed
  get advancedSortingData() {
    return [{
      firstName: 'Tom',
      lastName: 'Pale',
      points: faker.random.number({ min: 0, max: 100 })
    }, {
      firstName: 'Tom',
      lastName: 'Dale',
      points: faker.random.number({ min: 0, max: 100 })
    }, {
      firstName: 'Yehuda',
      lastName: 'Katz',
      points: faker.random.number({ min: 0, max: 100 })
    }, {
      firstName: 'Yehuda',
      lastName: 'Catz',
      points: faker.random.number({ min: 0, max: 100 })
    }, {
      firstName: 'Tom',
      lastName: 'Dayle',
      points: faker.random.number({ min: 0, max: 100 })
    }]
  }

}
