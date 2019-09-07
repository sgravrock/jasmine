describe('GlobalErrorSpy', function() {
  it('adds a global error handler', function() {
    var globalErrors = jasmine.createSpyObj('globalErrors', ['pushListener']),
      subject = new jasmineUnderTest.GlobalErrorSpy(globalErrors);

    expect(globalErrors.pushListener).toHaveBeenCalledWith(jasmine.any(Function));
  });

  it('records global errors', function() {
    var globalErrors = jasmine.createSpyObj('globalErrors', ['pushListener']),
      subject = new jasmineUnderTest.GlobalErrorSpy(globalErrors);

    // TODO: Make sure this works with node too
    globalErrors.pushListener.calls.argsFor(0)[0]('nope');
    expect(subject.errors).toEqual(['nope']);
  });

  describe('#uninstall', function() {
    it('removes the global error handler', function() {
      var globalErrors = jasmine.createSpyObj('globalErrors', ['pushListener', 'popListener']),
        subject = new jasmineUnderTest.GlobalErrorSpy(globalErrors);

      subject.uninstall();
      expect(globalErrors.popListener).toHaveBeenCalledWith();
    });

    // TODO: needs to be a spec error rather than an exception,
    // so we can report more than one.
    // TODO: needs to include stack traces.
    it('throws if any unexpected global errors occurred', function() {
      var globalErrors = jasmine.createSpyObj('globalErrors', ['pushListener', 'popListener']),
        subject = new jasmineUnderTest.GlobalErrorSpy(globalErrors);

      globalErrors.pushListener.calls.argsFor(0)[0]('foo');
      globalErrors.pushListener.calls.argsFor(0)[0]('bar');
      subject.markErrorExpected(0);

      expect(function() { subject.uninstall(); }).toThrow(
        "Error: Unexpected global error: 'bar'"
      );
    });

    it('does not throw if all global errors were expected', function() {
      var globalErrors = jasmine.createSpyObj('globalErrors', ['pushListener', 'popListener']),
        subject = new jasmineUnderTest.GlobalErrorSpy(globalErrors);

      globalErrors.pushListener.calls.argsFor(0)[0]('foo');
      globalErrors.pushListener.calls.argsFor(0)[0]('bar');
      subject.markErrorExpected(0);
      subject.markErrorExpected(1);

      expect(function() { subject.uninstall(); }).not.toThrow();
    });
  });
});
