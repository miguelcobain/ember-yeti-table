import { faker } from '@faker-js/faker';

export interface Person {
  firstName: string;
  lastName: string;
  points: number;
}

faker.seed(42);

export function generatePeople(count: number): Person[] {
  return Array.from({ length: count }, () => ({
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    points: faker.number.int({ min: 0, max: 100 }),
  }));
}

export const peopleSmall: Person[] = generatePeople(5);
export const peopleMedium: Person[] = generatePeople(10);
export const peopleLarge: Person[] = generatePeople(50);

export const advancedSortingData: Person[] = [
  { firstName: 'Tom', lastName: 'Pale', points: 42 },
  { firstName: 'Tom', lastName: 'Dale', points: 78 },
  { firstName: 'Yehuda', lastName: 'Katz', points: 91 },
  { firstName: 'Yehuda', lastName: 'Catz', points: 33 },
  { firstName: 'Tom', lastName: 'Dayle', points: 64 },
];
