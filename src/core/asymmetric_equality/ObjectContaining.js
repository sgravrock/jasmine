getJasmineRequireObj().ObjectContaining = function(j$) {

  function ObjectContaining(sample) {
    this.sample = sample;
  }

  function getPrototype(obj) {
    if (Object.getPrototypeOf) {
      return Object.getPrototypeOf(obj);
    }

    if (obj.constructor.prototype == obj) {
      return null;
    }

    return obj.constructor.prototype;
  }

  function hasProperty(obj, property) {
    if (!obj) {
      return false;
    }

    if (Object.prototype.hasOwnProperty.call(obj, property)) {
      return true;
    }

    return hasProperty(getPrototype(obj), property);
  }

  ObjectContaining.prototype.asymmetricMatch = function(other, matchersUtil) {
    if (typeof(this.sample) !== 'object') { throw new Error('You must provide an object to objectContaining, not \''+this.sample+'\'.'); }

    for (var property in this.sample) {
      if (!hasProperty(other, property) ||
          !matchersUtil.equals(this.sample[property], other[property])) {
        return false;
      }
    }

    return true;
  };

  ObjectContaining.prototype.jasmineToString = function(pp) {
    return '<jasmine.objectContaining(' + pp(this.sample) + ')>';
  };

  return ObjectContaining;
};
