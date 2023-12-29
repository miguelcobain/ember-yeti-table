import { attr } from '@ember-data/model';
import Model from '@ember-data/model';

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

  get name() {
    return `${this.firstName} ${this.lastName}`;
  }
}
// END-SNIPPET
