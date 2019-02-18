import AddonDocsRouter, { docsRoute } from 'ember-cli-addon-docs/router';
import RouterScroll from 'ember-router-scroll';
import config from './config/environment';

const Router = AddonDocsRouter.extend(RouterScroll, {
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  docsRoute(this, function() {
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
