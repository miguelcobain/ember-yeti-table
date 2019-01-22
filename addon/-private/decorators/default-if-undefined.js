import { decorator } from '@ember-decorators/utils/decorator';

const VALUES = new WeakMap();

function getValues(object) {
  if (!VALUES.has(object)) {
    VALUES.set(object, Object.create(null));
  }

  return VALUES.get(object);
}

export default decorator(({ initializer, key, descriptor, ...desc }) => {
  delete descriptor.writable;
  return {
    ...desc,
    key,
    kind: 'method',
    descriptor: {
      ...descriptor,
      get() {
        const values = getValues(this);

        if (!(key in values)) {
          values[key] = initializer.call(this);
        }

        return values[key];
      },
      set(value) {
        getValues(this)[key] =
          value === undefined ? initializer.call(this) : value;
      }
    }
  };
});
