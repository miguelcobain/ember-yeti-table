/**
  Renders a `<thead>` element and yields the row component.

  ```hbs
  <table.thead as |head|>
    <head.row as |row|>
      <row.column @prop="firstName" as |column|>
        First name
        {{if column.isAscSorted "(sorted asc)"}}
        {{if column.isDescSorted "(sorted desc)"}}
      </row.column>
    </head.row>
  </table.thead>
  ```

  @class THead
  @yield {object} head
  @yield {Component} head.row
*/
import { hash } from '@ember/helper';
import THead from './thead/row.gjs';

// eslint-disable-next-line ember/no-empty-glimmer-component-classes
<template>
  <thead class={{@theme.thead}} ...attributes>
    {{yield
      (hash
        row=(component
          THead
          sortable=@sortable
          sortSequence=@sortSequence
          onColumnClick=@onColumnClick
          columns=@columns
          theme=@theme
          parent=@parent
        )
      )
    }}
  </thead>
</template>
/**
 * Adds a click action to the thead, called with the clicked column as an argument.
 *
 * @argument onColumnClick - action that is called when the column header is clicked
 * @type Function
 */
