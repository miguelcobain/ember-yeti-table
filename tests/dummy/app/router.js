import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('simple');
  this.route('pagination');
  this.route('ajax');
  this.route('api');
});

export default Router;
