import { computed } from '@ember/object';
import attr from 'ember-data/attr';
import Model from 'ember-data/model';

// BEGIN-SNIPPET user.js
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
    return `${this.firstName} ${this.lastName}`;
  }
}
// END-SNIPPET
