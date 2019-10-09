describe('asymmetricEqualityTesterArgCompatShim', function() {
  it('provides all the properties of the MatchersUtil', function() {
    var matchersUtil = {
        foo: function() {},
        bar: function() {}
      },
      shim = jasmineUnderTest.asymmetricEqualityTesterArgCompatShim(
        matchersUtil,
        []
      );

    expect(shim.foo).toBe(matchersUtil.foo);
    expect(shim.bar).toBe(matchersUtil.bar);
  });

  it('provides and deprecates all the properties of the customEqualityTesters', function() {
    var customEqualityTesters = [function() {}, function() {}],
      shim = jasmineUnderTest.asymmetricEqualityTesterArgCompatShim(
        {},
        customEqualityTesters
      ),
      deprecated = spyOn(jasmineUnderTest.getEnv(), 'deprecated'),
      expectedMessage =
        'The second argument to asymmetricMatch is now a MatchersUtil. ' +
        'Using it as an array of custom equality testers is deprecated and will stop ' +
        'working in a future release. TODO link to docs.';

    expect(shim.length).toBe(2);
    expect(deprecated).toHaveBeenCalledWith(expectedMessage);
    deprecated.calls.reset();

    expect(shim[0]).toBe(customEqualityTesters[0]);
    expect(deprecated).toHaveBeenCalledWith(expectedMessage);
    deprecated.calls.reset();

    expect(shim[1]).toBe(customEqualityTesters[1]);
    expect(deprecated).toHaveBeenCalledWith(expectedMessage);
  });

  it('provides and deprecates all the properties of Array.prototype', function() {
    var shim = jasmineUnderTest.asymmetricEqualityTesterArgCompatShim({}, []),
      deprecated = spyOn(jasmineUnderTest.getEnv(), 'deprecated'),
      expectedMessage =
        'The second argument to asymmetricMatch is now a MatchersUtil. ' +
        'Using it as an array of custom equality testers is deprecated and will stop ' +
        'working in a future release. TODO link to docs.';

    expect(shim.filter).toBe(Array.prototype.filter);
    expect(deprecated).toHaveBeenCalledWith(expectedMessage);
    deprecated.calls.reset();

    expect(shim.forEach).toBe(Array.prototype.forEach);
    expect(deprecated).toHaveBeenCalledWith(expectedMessage);
    deprecated.calls.reset();

    expect(shim.map).toBe(Array.prototype.map);
    expect(deprecated).toHaveBeenCalledWith(expectedMessage);
    deprecated.calls.reset();
  });

  it('does not deprecate properties of Object.prototype', function() {
    var shim = jasmineUnderTest.asymmetricEqualityTesterArgCompatShim({}, []),
      deprecated = spyOn(jasmineUnderTest.getEnv(), 'deprecated');

    expect(shim.hasOwnProperty).toBe(Object.prototype.hasOwnProperty);
    expect(shim.isPrototypeOf).toBe(Object.prototype.isPrototypeOf);

    expect(deprecated).not.toHaveBeenCalled();
  });
});
