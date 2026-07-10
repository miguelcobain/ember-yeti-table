# Sorting

## Enabling / disabling sorting

Yeti Table columns are sortable by default. Try to click the table headers in the example below.

You can disable sorting in any column by passing `@sortable={{false}}` to any column definition. If you want to disable sorting on all columns, instead of doing it on each column, you can pass `@sortable={{false}}` to the parent `<YetiTable>` component.

In the following example we disabled sorting on the second column.

<CodePreview src="/demos/sorting-simple.gts" />

## The `@sort` argument

You can also use the `@sort` argument on a column to start the table sorted by that column. Values are `"asc"` or `"desc"`.

<CodePreview src="/demos/sorting-default.gts" />

## Customization

You can customize what is rendered inside the column header by passing a block to the column component. The yielded `column` object exposes `isAscSorted` / `isDescSorted` / `isSorted` booleans so you can render your own sort indicators if you don't want to use the default theme classes.

```gts
<table.header as |header|>
  <header.column @prop="firstName" as |column|>
    First name
    {{#if column.isAscSorted}}▲{{else if column.isDescSorted}}▼{{/if}}
  </header.column>
</table.header>
```

## Multiple sorting

Sometimes we have slightly more advanced sorting requirements and need to sort on multiple columns. In this case you can just use the `@sort` property on multiple columns.

Let's say we want to sort by `firstName` ascending and then by `lastName` descending. We could pass `@sort="asc"` to the first name column and `@sort="desc"` to the last name column.

<CodePreview src="/demos/sorting-advanced.gts" />

Notice that the last names are sorted descending for the same first name.

> **Bonus:** you can shift+click on a header column to add a new sort to the existing ones!

## Advanced sorting

You can customize the sorting function by passing in a custom `@sortFunction` argument to a column. This function follows the standard `compare(a, b)` signature and should return a negative, zero, or positive number — same as `Array.prototype.sort`.

```gts
<header.column @prop="points" @sortFunction={{this.byPoints}}>
  Points
</header.column>
```

## Sort sequence

By default, clicking on a sortable column header will sort that column ascending, then descending, then back. This is the default behaviour.

You can customize this sequence using the `@sortSequence` argument. It can be either a comma-separated string or an array of strings. Accepted values are `"asc"`, `"desc"` and `"unsorted"`.

So if you want the first click to sort descending, the second to sort ascending and the third to go back to unsorted, you can use `<YetiTable @sortSequence="desc,asc,unsorted">`.

<CodePreview src="/demos/sorting-sequence.gts" />

You can also use `@sortSequence` on individual columns. Each column's sort sequence will default to whatever the value is for the global `<YetiTable>`.
