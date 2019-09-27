import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { A } from '@ember/array';
import faker from 'faker';

export default class StylingController extends Controller {
  numberOfRows = 50;

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

}
