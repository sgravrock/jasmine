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

  it('provides all the properties of the customEqualityTesters', function() {
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
});
