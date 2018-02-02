import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  numberOfRows: 10,

  data: computed('numberOfRows', function() {
    return Array.from(Array(this.get('numberOfRows')), (_, i) => {
      return {
        firstName: 'Miguel',
        lastName: 'Andrade',
        points: 12 * i
      };
    });
  })
});