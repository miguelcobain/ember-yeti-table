import { JSONAPISerializer, Serializer } from 'ember-cli-mirage';

export default JSONAPISerializer.extend({
  serialize(object, request) {
    let json = Serializer.prototype.serialize.apply(this, arguments);

    if (request.mirageMeta) {
      json.meta = request.mirageMeta;
    }

    return json;
  }
});
