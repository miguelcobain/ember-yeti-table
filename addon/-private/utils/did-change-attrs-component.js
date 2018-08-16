import Component from '@ember/component';

function isEqual(_, a, b) {
  return a === b;
}

/**
 * This component subclass provides a `didChangeAttrs` hook that
 * subclasses can implement. It will keep track of attr changes and
 * call the hook whenever any of the configured attrs changes.
 * Code taken from https://github.com/workmanw/ember-did-change-attrs
 */
export default class DidChangeAttrsComponent extends Component {

  constructor(props) {
    /**
     * didReceiveAttrs runs before the contructor (after calling super)
     * so we need thise hack to be able to set default values on the
     * constructor.
     * See: https://github.com/ember-decorators/ember-decorators/issues/123
     */
    props._didChangeAttrsBuffer = null; // this tracks previous state of any `trackAttrChanges`
    props.didChangeAttrsConfig = props.didChangeAttrsConfig === undefined ? [] : props.didChangeAttrsConfig; // attributes to track
    super(...arguments);
  }

  didReceiveAttrs() {
    let buffer = this.get('_didChangeAttrsBuffer');

    if (buffer === null) { // first run
      let config = this.get('didChangeAttrsConfig');
      let trackedAttrs = config.attrs;
      let initialValues = {};

      for (let i = 0; i < trackedAttrs.length; i++) {
        let key = trackedAttrs[i];
        initialValues[key] = this.get(key);
      }

      this.set('_didChangeAttrsBuffer', initialValues);
    }
  }

  didUpdateAttrs() {
    let config = this.get('didChangeAttrsConfig');
    let equalityFn = config.isEqual || isEqual;

    let trackedAttrs = config.attrs;
    let oldValues = this.get('_didChangeAttrsBuffer');
    let changes = {};

    for (let i = 0; i < trackedAttrs.length; i++) {
      let key = trackedAttrs[i];
      let current = this.get(key);
      let previous = oldValues[key];

      if (!equalityFn(key, previous, current)) {
        changes[key] = { previous, current };
        oldValues[key] = current;
      }
    }

    if (Object.keys(changes).length > 0) {
      this.didChangeAttrs(changes);
    }
  }

}
