'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    // Add options here
    'ember-cli-babel': { enableTypeScriptTransform: true },
    autoImport: {
      watchDependencies: ['ember-yeti-table'],
    },
    'ember-template-imports': {
      inline_source_map: defaults.environment === 'development',
    },
    'ember-cli-addon-docs': {
      documentingAddonAt: '../ember-yeti-table',
    }
  });

  const { maybeEmbroider } = require('@embroider/test-setup');

  return maybeEmbroider(app);
};
