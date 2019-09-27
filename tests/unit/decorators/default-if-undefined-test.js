import defaultTo from 'ember-yeti-table/-private/utils/default-to';
import { module, test } from 'qunit';

module('Unit | Decorators | @defaultIfUndefined', function() {
  test('it works', function(assert) {
    class Foo {
      @defaultTo('default')
      bar;
    }

    const foo = new Foo();
    assert.strictEqual(foo.bar, 'default');

    foo.bar = 'something else';
    assert.strictEqual(foo.bar, 'something else');

    foo.bar = undefined;
    assert.strictEqual(foo.bar, 'default');

    foo.bar = null;
    assert.strictEqual(foo.bar, null);
  });
});
