import { Factory } from 'miragejs';
import { faker } from '@faker-js/faker';

export default Factory.extend({
  firstName: () => faker.person.firstName(),
  lastName: () => faker.person.firstName(),
  age: () => faker.number.int({ max: 69, min: 18 }),
  email: () => faker.internet.email(),
  username: () => faker.internet.userName(),
  phone: () => faker.phone.number(),
  city: () => faker.location.city(),
  avatarUrl: () => faker.image.avatar()
});
