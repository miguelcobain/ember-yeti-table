import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

import faker from 'faker';

export default class PaginationController extends Controller {
  @tracked
  numberOfRows = 50;

  get data() {
    return Array.from(Array(this.numberOfRows), () => {
      return {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        points: faker.datatype.number({ min: 0, max: 100 })
      };
    });
  }
}
