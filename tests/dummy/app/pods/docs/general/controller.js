import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import faker from 'faker';

export default class GeneralController extends Controller {
  @tracked
  numberOfRows = 10;

  get data() {
    return Array.from(Array(this.numberOfRows), () => {
      return {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        points: faker.random.number({ min: 0, max: 100 })
      };
    });
  }
}
