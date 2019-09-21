getJasmineRequireObj().asymmetricEqualityTesterArgCompatShim = function(j$) {
  function asymmetricEqualityTesterArgCompatShim(
    matchersUtil,
    customEqualityTesters
  ) {
    var self = Object.create(matchersUtil),
      i;

    self.length = customEqualityTesters.length;

    for (i = 0; i < customEqualityTesters.length; i++) {
      self[i] = customEqualityTesters[i];
    }

    return self;
  }

  return asymmetricEqualityTesterArgCompatShim;
};
