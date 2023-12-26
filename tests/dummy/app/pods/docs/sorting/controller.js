import { A } from '@ember/array';
import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

import { faker } from '@faker-js/faker';

export default class SortingController extends Controller {
  @tracked
  numberOfRows = 5;

  get data() {
    return A(
      Array.from(Array(this.numberOfRows), () => {
        return {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          points: faker.number.int({ min: 0, max: 100 })
        };
      })
    );
  }

  get advancedSortingData() {
    return [
      {
        firstName: 'Tom',
        lastName: 'Pale',
        points: faker.number.int({ min: 0, max: 100 })
      },
      {
        firstName: 'Tom',
        lastName: 'Dale',
        points: faker.number.int({ min: 0, max: 100 })
      },
      {
        firstName: 'Yehuda',
        lastName: 'Katz',
        points: faker.number.int({ min: 0, max: 100 })
      },
      {
        firstName: 'Yehuda',
        lastName: 'Catz',
        points: faker.number.int({ min: 0, max: 100 })
      },
      {
        firstName: 'Tom',
        lastName: 'Dayle',
        points: faker.number.int({ min: 0, max: 100 })
      }
    ];
  }
}
