import { A } from '@ember/array';
import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

import faker from 'faker';

export default class SortingController extends Controller {
  @tracked
  numberOfRows = 5;

  get data() {
    return A(
      Array.from(Array(this.numberOfRows), () => {
        return {
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          points: faker.random.number({ min: 0, max: 100 })
        };
      })
    );
  }

  get advancedSortingData() {
    return [
      {
        firstName: 'Tom',
        lastName: 'Pale',
        points: faker.random.number({ min: 0, max: 100 })
      },
      {
        firstName: 'Tom',
        lastName: 'Dale',
        points: faker.random.number({ min: 0, max: 100 })
      },
      {
        firstName: 'Yehuda',
        lastName: 'Katz',
        points: faker.random.number({ min: 0, max: 100 })
      },
      {
        firstName: 'Yehuda',
        lastName: 'Catz',
        points: faker.random.number({ min: 0, max: 100 })
      },
      {
        firstName: 'Tom',
        lastName: 'Dayle',
        points: faker.random.number({ min: 0, max: 100 })
      }
    ];
  }
}
