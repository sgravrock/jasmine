getJasmineRequireObj().asymmetricEqualityTesterArgCompatShim = function(j$) {
  function asymmetricEqualityTesterArgCompatShim(
    matchersUtil,
    customEqualityTesters
  ) {
    var self = Object.create(matchersUtil),
      props,
      i,
      k;

    copyAndDeprecate(self, customEqualityTesters, 'length');

    for (i = 0; i < customEqualityTesters.length; i++) {
      copyAndDeprecate(self, customEqualityTesters, i);
    }

    props = Object.getOwnPropertyDescriptors(Array.prototype);

    for (k in props) {
      if (props.hasOwnProperty(k) && k !== 'length') {
        copyAndDeprecate(self, Array.prototype, k);
      }
    }

    return self;
  }

  function copyAndDeprecate(dest, src, propName) {
    Object.defineProperty(dest, propName, {
      get: function() {
        j$.getEnv().deprecated(
          'The second argument to asymmetricMatch is now a ' +
            'MatchersUtil. Using it as an array of custom equality testers is ' +
            'deprecated and will stop working in a future release. TODO link to docs.'
        );
        return src[propName];
      }
    });
  }

  return asymmetricEqualityTesterArgCompatShim;
};
