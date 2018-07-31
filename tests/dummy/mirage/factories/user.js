import { Factory } from 'ember-cli-mirage';
import faker from 'faker';

export default Factory.extend({
  firstName: () => faker.name.firstName(),
  lastName: () => faker.name.firstName(),
  age: () => faker.random.number({ max: 69, min: 18 }),
  email: () => faker.internet.email(),
  username: () => faker.internet.userName(),
  phone: () => faker.phone.phoneNumber(),
  city: () => faker.address.city(),
  avatarUrl: () => faker.image.avatar()
});
