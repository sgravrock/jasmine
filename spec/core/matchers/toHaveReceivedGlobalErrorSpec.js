describe('toHaveReceivedGlobalErrorSpec', function () {
  it('throws if the actual is not a GlobalErrorSpy', function () {
    var matcher = jasmineUnderTest.matchers.toHaveReceivedGlobalError();

    expect(function () {
      matcher.compare('not an error', '');
    }).toThrowError("'not an error' is not a GlobalErrorSpy");
  });

  // TODO: report all errors in messages? For better compatibility with IDEA plugin.

  describe('When an error message exactly matches the expected string', function () {
    it('passes', function () {
      var matcher = jasmineUnderTest.matchers.toHaveReceivedGlobalError(),
        globalErrors = jasmine.createSpyObj('globalErrors', ['pushListener']),
        globalErrorSpy = new jasmineUnderTest.GlobalErrorSpy(globalErrors),
        result;

      globalErrors.pushListener.calls.argsFor(0)[0]('nope');
      result = matcher.compare(globalErrorSpy, 'nope');

      expect(result).toEqual({
        pass: true,
        message: 'Expected a global error with message "nope" to have occurred but it did not occur'
      });
    });

    it('marks the matching error expected', function () {
      var matcher = jasmineUnderTest.matchers.toHaveReceivedGlobalError(),
        globalErrors = jasmine.createSpyObj('globalErrors', ['pushListener']),
        globalErrorSpy = new jasmineUnderTest.GlobalErrorSpy(globalErrors),
        result;

      globalErrors.pushListener.calls.argsFor(0)[0]('other');
      globalErrors.pushListener.calls.argsFor(0)[0]('nope');
      matcher.compare(globalErrorSpy, 'nope');

      expect(globalErrorSpy.errorsExpected[0]).toBeFalsy();
      expect(globalErrorSpy.errorsExpected[1]).toEqual(true);
    });
  });

  describe('When no error message exactly matches the expected string', function () {
    it('fails', function () {
      var matcher = jasmineUnderTest.matchers.toHaveReceivedGlobalError(),
        globalErrors = jasmine.createSpyObj('globalErrors', ['pushListener']),
        globalErrorSpy = new jasmineUnderTest.GlobalErrorSpy(globalErrors),
        result;

      globalErrors.pushListener.calls.argsFor(0)[0]('nopenope');
      result = matcher.compare(globalErrorSpy, 'nope');

      expect(result).toEqual({
        pass: false,
        message: 'Expected a global error with message "nope" to have occurred but it did not occur'
      });
    });

    it('does not mark any errors expected', function() {
      var matcher = jasmineUnderTest.matchers.toHaveReceivedGlobalError(),
        globalErrors = jasmine.createSpyObj('globalErrors', ['pushListener']),
        globalErrorSpy = new jasmineUnderTest.GlobalErrorSpy(globalErrors),
        result;

      globalErrors.pushListener.calls.argsFor(0)[0]('nopenope');
      result = matcher.compare(globalErrorSpy, 'nope');

      expect(globalErrorSpy.errorsExpected[0]).toBeFalsy();
    });
  });
});
