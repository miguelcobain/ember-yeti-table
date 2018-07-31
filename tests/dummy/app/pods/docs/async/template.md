

{{#docs-demo as |demo|}}
  {{#demo.example name="async-simple.hbs"}}

    <YetiTable class="material-table" @loadData={{action loadData}} @pagination={{true}} @pageSize={{20}} @totalRows={{totalRows}} as |table|>
      
      <table.header as |header|>
        <header.column @prop="avatarUrl" @sortable={{false}}>
          Avatar
        </header.column>
        <header.column @prop="firstName">
          First name
        </header.column>
        <header.column @prop="lastName">
          Last name
        </header.column>
        <header.column @prop="email">
          E-mail
        </header.column>
        <header.column @prop="age">
          Age
        </header.column>
      </table.header>

      <table.body as |body user|>
        <body.row as |row|>
          <row.cell @class="avatar-cell">
            <img class="avatar" src={{user.avatarUrl}} alt={{user.name}}>
          </row.cell>
          <row.cell>
            {{user.firstName}}
          </row.cell>
          <row.cell>
            {{user.lastName}}
          </row.cell>
          <row.cell>
            {{user.email}}
          </row.cell>
          <row.cell>
            {{user.age}}
          </row.cell>
        </body.row>
      </table.body>

      <tfoot>
        <tr>
          <td colspan="5">
            <div class="pagination-controls">
              <div>
                Rows per page:
                <XSelect @value={{table.paginationData.pageSize}} @action={{action table.actions.changePageSize}} as |xs|>
                  <xs.option @value={{10}}>10</xs.option>
                  <xs.option @value={{15}}>15</xs.option>
                  <xs.option @value={{20}}>20</xs.option>
                  <xs.option @value={{25}}>25</xs.option>
                </XSelect>
              </div>

              <div class="page-info">
                {{add table.paginationData.pageStart 1}} - {{add table.paginationData.pageEnd 1}} of {{table.paginationData.totalRows}}
              </div>

              <button class="previous" disabled={{table.paginationData.isFirstPage}} onclick={{action table.actions.previousPage}}>
                <i class="material-icons">keyboard_arrow_left</i>
              </button>

              <button class="next" disabled={{table.paginationData.isLastPage}} onclick={{action table.actions.nextPage}}>
                <i class="material-icons">keyboard_arrow_right</i>
              </button>
            </div>
          </td>
        </tr>
      </tfoot>

    </YetiTable>

  {{/demo.example}}

  {{demo.snippet "async-simple.hbs"}}
{{/docs-demo}}
