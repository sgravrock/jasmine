getJasmineRequireObj().ArrayContaining = function(j$) {
  function ArrayContaining(sample) {
    this.sample = sample;
  }

  ArrayContaining.prototype.asymmetricMatch = function(other, matchersUtil) {
    if (!j$.isArray_(this.sample)) {
      throw new Error('You must provide an array to arrayContaining, not ' + j$.pp(this.sample) + '.');
    }

    for (var i = 0; i < this.sample.length; i++) {
      var item = this.sample[i];
      if (!matchersUtil.contains(other, item)) {
        return false;
      }
    }

    return true;
  };

  ArrayContaining.prototype.jasmineToString = function () {
    return '<jasmine.arrayContaining(' + jasmine.pp(this.sample) +')>';
  };

  return ArrayContaining;
};
