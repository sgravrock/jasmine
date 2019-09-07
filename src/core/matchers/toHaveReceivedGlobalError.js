getJasmineRequireObj().toHaveReceivedGlobalError = function(j$) {
  // TODO jsdocs (here and elsewhere)
  function toHaveReceivedGlobalError() {
    return {
      compare: function(actual, expected) {
        var i,
          message = 'Expected a global error with message "' + expected +
            '" to have occurred but it did not occur';

        if (!(actual instanceof j$.GlobalErrorSpy)) {
          throw new Error("'" + actual + "' is not a GlobalErrorSpy");
        }

        // TODO try to encapsulate this better in the GlobalErrorSpy
        for (i = 0; i < actual.errors.length; i++) {
          if (actual.errors[i] === expected) {
            actual.markErrorExpected(i);
            return {
              pass: true,
              message: message
            };
          }
        }

        return {
          pass: false,
          message: message
        };
      }
    };
  }

  function pass(expected) {
    return {
      pass: true,
      message: message
    };
  }

  function fail(message) {
    return {
      pass: false,
      message: message
    };
  }

  return toHaveReceivedGlobalError;
};
