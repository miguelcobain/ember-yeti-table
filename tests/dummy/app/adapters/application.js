import JSONAPIAdapter from '@ember-data/adapter/json-api';

// eslint-disable-next-line ember/no-mixins
import AdapterFetch from 'ember-fetch/mixins/adapter-fetch';

export default JSONAPIAdapter.extend(AdapterFetch);
