import { A } from '@ember/array';
import Controller from '@ember/controller';
import { computed } from '@ember/object';

import faker from 'faker';

export default class GeneralController extends Controller {
  numberOfRows = 10;

  @computed('numberOfRows')
  get data() {
    return A(
      Array.from(Array(this.get('numberOfRows')), () => {
        return {
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          points: faker.random.number({ min: 0, max: 100 })
        };
      })
    );
  }
}
