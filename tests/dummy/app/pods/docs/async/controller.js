import Controller from '@ember/controller';
import { action } from '@ember-decorators/object';

export default class AsyncController extends Controller {

  // BEGIN-SNIPPET async-simple.js
  @action
  async loadData({ paginationData, sortData, filterData }) {
    let params = {
      sortBy: sortData.map((s) => s.prop),
      sortDir: sortData.map((s) => s.direction),
      pageNumber: paginationData.pageNumber,
      pageSize: paginationData.pageSize,
      filter: filterData.filter
    };

    let users = await this.store.query('user', params);

    // we need to inform Yeti Table about the total number of rows
    // for pagination to work correctly. Check out the pagination guide.
    this.set('totalRows', users.get('meta.totalRows'));

    return users;
  }
  // END-SNIPPET

}
