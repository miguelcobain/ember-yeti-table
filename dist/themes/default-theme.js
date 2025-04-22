// BEGIN-SNIPPET default-theme.js
var DEFAULT_THEME = {
  // applied to the <table> element
  table: 'yeti-table',
  // applied to any <tr>, wether it is from the header, body or footer
  row: '',
  // applied to the <thead> element
  thead: '',
  // applied to <tr> rows inside the <thead> element
  theadRow: '',
  // applied to <th> cells inside the <thead> element
  theadCell: '',
  // applied to the <tbody> element
  tbody: '',
  // applied to <tr> rows inside the <tbody> element
  tbodyRow: '',
  // applied to <td> cells inside the <thead> element
  tbodyCell: '',
  // applied to the <tfoot> element
  tfoot: '',
  // applied to <tr> rows inside the <tfoot> element
  tfootRow: '',
  // applied to <td> cells inside the <tfoot> element
  tfootCell: '',
  sorting: {
    // applied to <th> header cells when column is sortable
    columnSortable: 'yeti-table-sortable',
    // applied to <th> header cells when column is currently sorted
    columnSorted: 'yeti-table-sorted',
    // applied to <th> header cells when column is currently sorted ascending
    columnSortedAsc: 'yeti-table-sorted-asc',
    // applied to <th> header cells when column is currently sorted descending
    columnSortedDesc: 'yeti-table-sorted-desc'
  },
  pagination: {
    // applied to the pagination controls container
    controls: 'yeti-table-pagination-controls',
    // applied to the pagination information element
    info: 'yeti-table-pagination-controls-page-info',
    // applied to the pageSize select element
    pageSize: 'yeti-table-pagination-controls-page-size',
    // applied to the next button
    next: 'yeti-table-pagination-controls-next',
    // applied to the previous button
    previous: 'yeti-table-pagination-controls-previous'
  }
};
// END-SNIPPET

export { DEFAULT_THEME as default };
//# sourceMappingURL=default-theme.js.map
