import { helper } from '@ember/component/helper';

/**
 * We need an `eq` helper for the pagination controls page size selector, but:
 * - we can't assume people will have ember-truth-helpers installed
 * - including the entire ember-truth-helpers addon as a dependency brings too much unecessary stuff
 *
 * So we build this private simple helper.
 */
export function yetiTableEq([param1, param2]) {
  return param1 === param2;
}

export default helper(yetiTableEq);
