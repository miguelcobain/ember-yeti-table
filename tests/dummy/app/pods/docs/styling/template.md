# Styling

## No styles included!

**Yeti Table does not include any styles in your app.**

You should think of Yeti Table as your companion when rendering HTML table markup and
dealing with the sometimes complex logic of pagination or async data sources.

You are free to use any css you want to style your tables. Yeti Table aims to be
unopinionated in this matter. Chances are you're already using Bootstrap or Foundation, for example.
Maybe you're using your own custom styles?

No problem. Yeti Table should be flexible enough for you to render the markup you need.

## Classes

Yeti table does provide classes for you to use at each element of the table as a theme. 
You may use the class names in the theme as provided or override elements of a theme with your 
own class names 

Yeti Table default theme is defined as:

{{docs-snippet name="default-theme.js"}}

If you wish to override just the `tbodyRow` class you can do the following:

```hbs
<YetiTable @theme={{hash tbodyRow="my-new-class"}} @data={{data}} @pagination={{true}} as |table|>
  <table.header as |header|>
    ...
  </table.header>

  <table.body as |body user|>
    <body.row as |row|>
      ...
    </body.row>
  </table.body>
</YetiTable>
```

## Examples

If you're interested in the styles that are used in these pages, you can use them, of course.
You can grab them [here](https://github.com/miguelcobain/ember-yeti-table/blob/master/tests/dummy/app/styles/material.scss).

The fact that Yeti Table was built with flexibility in mind should give you all the freedom
to customize markup to fit needs of many css frameworks like Bootstrap. Usually all it takes is a css class
here and there.

For example, bootstrap requires you to add some classes on the table elements. Note that the body row class
required a conditional and therefore wasn't overridden in the theme, but could still be specified 
using the `class` attribute 

Here's an example:

```hbs
<YetiTable @theme={{table="table table-striped table-hover" thead="thead-dark"}} @data={{data}} @pagination={{true}} as |table|>
  <table.header as |header|>
    ...
  </table.header>

  <table.body as |body user|>
    <body.row class={{if user.isActive "table-success"}} as |row|>
      ...
    </body.row>
  </table.body>
</YetiTable>
```

Other css utilities follow the same strategy.

## Pagination controls outside the table element

By default, the `<YetiTable>` component renders a `<table>` HTML element. This can be sometimes
problematic for some pagination controls because their styling can depend on being rendered
outside the `<table>` element.

You can work around this problem by using something like:

```hbs
<YetiTable @tagName="" @data={{data}} @pagination={{true}} as |t|>

  <table> {{!-- we render our own table element here --}}
    <t.header as |header|>
      ...
    </t.header>

    <t.body/>
  </table>

  <t.pagination/> {{!-- pagination controls outside the <table> element --}}

</YetiTable>
```

Basically we told Yeti Table to not render any element by specifying `@tagName=""`
and then we render our own `<table>` element inside.

Another possible approach (perhaps semantically more interesting?) to place
the pagination controls is to use a full-span cell on the table footer.
Here is how to do that:

```hbs
<YetiTable @data={{data}} @pagination={{true}} as |table|>

  <table.header as |header|>
    ...
  </table.header>

  <table.body/>

  <table.foot as |foot|>
    <foot.row as |row|>
      <row.cell colspan={{table.visibleColumns}}>
        <table.pagination/>
      </row.cell>
    </foot.row>
  </table.foot>

</YetiTable>
```

By using `colspan={{table.visibleColumns}}` we can make sure that the footer cell always spans across
all columns.
