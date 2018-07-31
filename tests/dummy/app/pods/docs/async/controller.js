import Controller from '@ember/controller';

export default class AsyncController extends Controller {

  async loadData({ paginationData, sortData }) {
    let params = {};

    params.sortBy = sortData.map((s) => s.prop);
    params.sortDir = sortData.map((s) => s.direction);

    params.pageNumber = paginationData.pageNumber;
    params.pageSize = paginationData.pageSize;

    let users = await this.store.query('user', params);

    this.set('totalRows', users.get('meta.totalRows'));

    return users;
  }

}
