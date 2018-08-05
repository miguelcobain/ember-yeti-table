# Legacy usage

You may have noticed that all of the examples for Yeti Table on this docs site
are using angle bracket syntax (.e.g. `<YetiTable>`). This is an exciting new
feature of Ember that has been polyfilled for all versions of Ember 2.12+, and
is definitely recommended if you can use it.

If you are on a version of Ember that does not support angle bracket syntax, you
can still invoke Yeti Table with the curly style. Angle brackets are an
alternative syntax for curly style component invocations, and do not add any
extra features. To see the differences, check out the
[angle bracket syntax polyfill](https://github.com/rwjblue/ember-angle-bracket-invocation-polyfill)
or the original [angle bracket invocation rfc](https://github.com/emberjs/rfcs/blob/master/text/0311-angle-bracket-invocation.md).

This is what a typical usage of Yeti Table with curly style invocation looks like:

```hbs
{{#yeti-table data=data as |table|}}

  {{#table.header as |header|}}
    {{#header.column prop="firstName"}}
      First name
    {{/header.column}}
    {{#header.column prop="lastName"}}
      Last name
    {{/header.column}}
    {{#header.column prop="points"}}
      Points
    {{/header.column}}
  {{/table.header}}

  {{table.body}}

{{/yeti-table}}
```
