import config from 'dummy/config/environment';
import AddonDocsRouter, { docsRoute } from 'ember-cli-addon-docs/router';

class Router extends AddonDocsRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  docsRoute(this, function () {
    this.route('quickstart');
    this.route('why-yeti-table');
    this.route('general');
    this.route('sorting');
    this.route('filtering');
    this.route('pagination');
    this.route('async');
    this.route('styling');
    this.route('configuration');
  });

  this.route('not-found', { path: '/*path' });
});

export default Router;
