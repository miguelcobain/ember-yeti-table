import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

import { faker } from '@faker-js/faker';

export default class StylingController extends Controller {
  @tracked
  numberOfRows = 50;

  get data() {
    return Array.from(Array(this.numberOfRows), () => {
      return {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        points: faker.number.int({ min: 0, max: 100 })
      };
    });
  }
}
