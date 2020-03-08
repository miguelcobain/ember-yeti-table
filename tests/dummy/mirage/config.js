import createRegex from 'ember-yeti-table/-private/utils/create-regex';
import {
  sortMultiple as sortFunction,
  compareValues as compareFunction
} from 'ember-yeti-table/-private/utils/sorting-utils';

export default function() {
  // These comments are here to help you get started. Feel free to delete them.

  /*
    Config (with defaults).

    Note: these only affect routes defined *after* them!
  */

  // this.urlPrefix = '';    // make this `http://localhost:8080`, for example, if your API is on a different server
  // this.namespace = '';    // make this `/api`, for example, if your API is namespaced
  // this.timing = 400;      // delay for each request, automatically set to 0 during testing

  /*
    Shorthand cheatsheet:

    this.get('/posts');
    this.post('/posts');
    this.get('/posts/:id');
    this.put('/posts/:id'); // or this.patch
    this.del('/posts/:id');

    http://www.ember-cli-mirage.com/docs/v0.3.x/shorthands/
  */

  this.get('/users', ({ users }, request) => {
    let { pageSize, pageNumber, sortBy, sortDir, filter } = request.queryParams;

    let records = users.all();

    // add this so we can have this info on the serializer
    request.mirageMeta = { totalRows: records.length };

    if (filter) {
      let regex = createRegex(filter, false, true, true);
      records = records.filter(item => {
        return ['firstName', 'lastName', 'email', 'age'].some(key => {
          return regex.test(item.attrs[key]);
        });
      });
    }

    if (sortBy) {
      let sortings = sortBy.map((prop, i) => {
        return { prop, direction: sortDir[i] };
      });

      records = records.sort((itemA, itemB) => {
        return sortFunction(itemA, itemB, sortings, compareFunction);
      });
    }

    let start = (parseInt(pageNumber) - 1) * pageSize;
    let end = parseInt(pageNumber) * pageSize;

    return records.slice(start, end);
  });

  this.passthrough();
}
