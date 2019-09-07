getJasmineRequireObj().GlobalErrorSpy = function(j$) {
  function GlobalErrorSpy(globalErrors) {
    this.errors = [];
    this.errorsExpected = [];

    console.log("GES installing");
    globalErrors.pushListener(function(error) {
      console.log("GES got error");
      this.errors.push(error);
    }.bind(this));

    this.uninstall = function() {
      var i;

      console.log("GES uninstalling");
      globalErrors.popListener();

      for (i = 0; i < this.errors.length; i++) {
        if (!this.errorsExpected[i]) {
          throw new Error("Unexpected global error: '" + this.errors[i]) + "'";
        }
      }
    };

    this.markErrorExpected = function(errorIndex) {
      this.errorsExpected[errorIndex] = true;
    };
  }

  return GlobalErrorSpy;
};
