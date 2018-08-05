import { helper } from '@ember/component/helper';

export function yetiTableEq([param1, param2]) {
  return param1 === param2;
}

export default helper(yetiTableEq);
