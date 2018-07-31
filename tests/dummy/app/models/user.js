import Model from 'ember-data/model';
import { attr } from '@ember-decorators/data';
import { computed } from '@ember-decorators/object';

export default class User extends Model {
  @attr('string') firstName;
  @attr('string') lastName;
  @attr('number') age;
  @attr('string') email;
  @attr('string') username;
  @attr('string') phone;
  @attr('string') city;
  @attr('string') avatarUrl;

  @computed('firstName', 'lastName')
  get name() {
    const first = this.get('firstName');
    const last = this.get('lastName');

    return `${first} ${last}`;
  }
}
