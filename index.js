'use strict';

module.exports = {
  name: require('./package').name,

  options: {
    babel: {
      plugins: [
        // Ensure that `ember-auto-import` can handle the dynamic imports
        require('ember-auto-import/babel-plugin')
      ]
    }
  }
};
