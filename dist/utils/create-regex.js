import { isBlank } from '@ember/utils';

const ESCAPE_REGEX = new RegExp('(\\' + ['/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\', '$', '^', '-'].join('|\\') + ')', 'g');
function escapeRegex(val) {
  return val.replace(ESCAPE_REGEX, '\\$1');
}
function createRegex(search, regex = false, smart = true, caseInsensitive = true) {
  if (isBlank(search)) {
    return;
  }
  search = regex ? search : escapeRegex(search);
  if (smart) {
    /* For smart filtering we want to allow the search to work regardless of
     * word order. We also want double quoted text to be preserved, so word
     * order is important - a la google. So this is what we want to
     * generate:
     *
     * ^(?=.*?\bone\b)(?=.*?\btwo three\b)(?=.*?\bfour\b).*$
     */
    let words = search.match(/"[^"]+"|[^ ]+/g) || [''];
    let a = words.map(word => {
      if (word.charAt(0) === '"') {
        let m = word.match(/^"(.*)"$/);
        word = m ? m[1] : word;
      }
      return word.replace('"', '');
    });
    search = `^(?=.*?${a.join(')(?=.*?')}).*$`;
  }
  return new RegExp(search, caseInsensitive ? 'i' : '');
}

export { createRegex as default };
//# sourceMappingURL=create-regex.js.map
