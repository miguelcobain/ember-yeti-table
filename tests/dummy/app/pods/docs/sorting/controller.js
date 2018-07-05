import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { A } from '@ember/array';
import faker from 'faker';

export default Controller.extend({
  numberOfRows: 10,

  data: computed('numberOfRows', function() {
    return A(Array.from(Array(this.get('numberOfRows')), () => {
      return {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        points: faker.random.number({ min: 0, max: 100 })
      };
    }));
  }),

  advancedSortingData: computed(function() {
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
  })
});