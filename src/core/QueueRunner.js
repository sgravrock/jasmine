var nextQid = 0;

getJasmineRequireObj().QueueRunner = function(j$) {

  function once(fn) {
    var called = false;
    return function() {
      if (!called) {
        called = true;
        fn();
      }
      return null;
    };
  }

  function QueueRunner(attrs) {
    this.queueableFns = attrs.queueableFns || [];
    var self = this;
    this.onComplete = function() {
      var f = attrs.onComplete || function() {};
      console.log('QueueRunner ' + self.qid + ' calling onComplete');
      f();
    };
    this.clearStack = attrs.clearStack || function(fn) {fn();};
    this.onException = attrs.onException || function() {};
    this.catchException = attrs.catchException || function() { return true; };
    this.userContext = attrs.userContext || {};
    this.timeout = attrs.timeout || {setTimeout: setTimeout, clearTimeout: clearTimeout};
    this.fail = attrs.fail || function() {};
    this.globalErrors = attrs.globalErrors || { pushListener: function() {}, popListener: function() {} };
    this.qid = ++nextQid;
  }

  QueueRunner.prototype.execute = function() {
    console.log('QueueRunner ' + this.qid + ' executing');
    this.run(this.queueableFns, 0);
  };

  var nextAid = 0;

  QueueRunner.prototype.run = function(queueableFns, recursiveIndex) {
    var length = queueableFns.length,
      self = this,
      iterativeIndex;


    for(iterativeIndex = recursiveIndex; iterativeIndex < length; iterativeIndex++) {
      var queueableFn = queueableFns[iterativeIndex];
      if (queueableFn.fn.length > 0) {
        attemptAsync(queueableFn);
        return;
      } else {
        attemptSync(queueableFn);
      }
    }

    console.log('QueueRunner ' + self.qid + ' calling clearStack');
    this.clearStack(this.onComplete);

    function attemptSync(queueableFn) {
      try {
        queueableFn.fn.call(self.userContext);
      } catch (e) {
        handleException(e, queueableFn);
      }
    }

    function attemptAsync(queueableFn) {
      var aid = ++nextAid;
      var clearTimeout = function () {
          Function.prototype.apply.apply(self.timeout.clearTimeout, [j$.getGlobal(), [timeoutId]]);
        },
        handleError = function(error) {
          console.log(self.qid + '[' + aid + '] handleError() about to call onException (' + queueableFn.description + ')');
          onException(error);
          console.log(self.qid + '[' + aid + '] handleError() about to call next (' + queueableFn.description + ')');
          next();
        },
        next = once(function () {
          console.log(self.qid + '[' + aid + '] next() (' + queueableFn.description + ')');
          console.log('(' + iterativeIndex + ' of ' + queueableFns.length + ')');
          clearTimeout(timeoutId);
          self.globalErrors.popListener(handleError);
          self.run(queueableFns, iterativeIndex + 1);
        }),
        timeoutId;

      next.fail = function() {
        self.fail.apply(null, arguments);
        next();
      };

      self.globalErrors.pushListener(handleError);

      if (queueableFn.timeout) {
        timeoutId = Function.prototype.apply.apply(self.timeout.setTimeout, [j$.getGlobal(), [function() {
          var error = new Error('Timeout - Async callback was not invoked within timeout specified by jasmine.DEFAULT_TIMEOUT_INTERVAL.');
          onException(error);
          next();
        }, queueableFn.timeout()]]);
      }

      try {
        console.log(self.qid + '[' + aid + '] calling queueable (' + queueableFn.description + ')');
        queueableFn.fn.call(self.userContext, next);
      } catch (e) {
        handleException(e, queueableFn);
        next();
      }
    }

    function onException(e) {
      self.onException(e);
    }

    function handleException(e, queueableFn) {
      onException(e);
      if (!self.catchException(e)) {
        //TODO: set a var when we catch an exception and
        //use a finally block to close the loop in a nice way..
        throw e;
      }
    }
  };

  return QueueRunner;
};
