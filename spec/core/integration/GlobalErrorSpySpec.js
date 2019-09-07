describe('GlobalErrorSpy integration', function () {
  beforeEach(function() {
    jasmine.getEnv().registerIntegrationMatchers();
  });

  it('passes if all expected errors occur', function (done) {
    var env = new jasmineUnderTest.Env(),
      reporter = jasmine.createSpyObj('fakeReporter', ['specDone', 'jasmineDone']);

    reporter.jasmineDone.and.callFake(function() {
      expect(reporter.specDone).toHaveFailedExpectationsForRunnable('passes', []);
      done();
    });

    env.addReporter(reporter);

    env.it('passes', function(specDone) {
      var globalErrorSpy = jasmineUnderTest.spyOnGlobalErrors();

      setTimeout(function () {
        throw new Error('nope')
      });

      setTimeout(function () {
        throw new Error('nor this either')
      });

      setTimeout(function() {
        env.expect(globalErrorSpy).toHaveReceivedGlobalError('nor this either');
        env.expect(globalErrorSpy).toHaveReceivedGlobalError('nope');
        specDone();
      });
    });

    env.execute();
  });

  it('fails if any expected error does not occur', function (done) {
    var env = new jasmineUnderTest.Env(),
      reporter = jasmine.createSpyObj('fakeReporter', ['specDone', 'jasmineDone']);

    reporter.jasmineDone.and.callFake(function() {
      expect(reporter.specDone).toHaveFailedExpectationsForRunnable(
        'fails',
        ['Expected a global error with message "nope" to have occurred but it did not occur']
      );
      done();
    });

    env.addReporter(reporter);

    env.it('fails', function() {
      var globalErrorSpy = env.spyOnGlobalErrors();
      env.expect(globalErrorSpy).toHaveReceivedGlobalError('nope');
    });

    env.execute();
  });

  // TODO: include the stack trace
  // TODO: This fails in part because the pushes and pops become interleaved:
  // 1. QueueRunner push
  // 2. GlobalErrorSpy push
  // 3. QueueRunner pop
  // 4. GlobalErrorSpy pop
  fit('fails if an unexpected error occurs', function(done) {
    var env = new jasmineUnderTest.Env(),
      reporter = jasmine.createSpyObj('fakeReporter', ['specDone', 'jasmineDone']);

    // TODO remove this
    reporter.specDone.and.callFake(function() {
      console.error(new Error("specDone stack"))
      console.log("specDone", arguments);
    });

    reporter.jasmineDone.and.callFake(function() {
      debugger;
      expect(reporter.specDone).toHaveFailedExpectationsForRunnable(
        'fails',
        ['Unexpected global error: "nope"']
      );
      console.log("jasmine done");
      done();
    });

    env.addReporter(reporter);

    env.it('fails', function(specDone) {
      var globalErrorSpy = env.spyOnGlobalErrors();

      setTimeout(function () {
        console.log("erroring");
        throw new Error('nope')
      });

      console.log("setting timeout")
      setTimeout(function() {
        console.log("calling specDone");
        debugger;
        specDone();
      });
    });

    console.log("executing")
    env.execute();
  });

  // Possibly test a la "removes a spy from the top suite after the run is complete" in EnvSpec.js
  it('removes any global error spy when the spec completes');

  // We might support this in the future, but until we clean up suite-level global error spies,
  // prohibit them.
  it('does not allow global error spies at the suite level');
});


// Promise variant:
// describe('GlobalErrorSpy', function () {
//   it('passes if all expected errors occur', function () {
//     return jasmine.withGlobalErrorSpy(function (globalErrorSpy) {
//       setTimeout(function () {
//         throw new Error('nope')
//       });
//       setTimeout(function () {
//         throw new Error('nor this either')
//       });
//
//       return new Promise(function (resolve) {
//         setTimeout(function () {
//           env.expect(globalErrorSpy).toHaveReceivedGlobalError('nor this either');
//           env.expect(globalErrorSpy).toHaveReceivedGlobalError('nope');
//           resolve();
//         });
//       });
//     });
//   });
//
//   it('fails if any expected error does not occur', function () {
//     return jasmine.withGlobalErrorSpy(function (globalErrorSpy) {
//       return new Promise(function (resolve) {
//         env.expect(globalErrorSpy).toHaveReceivedGlobalError('nope');
//         setTimeout(resolve);
//       });
//     });
//   });
//
//   it('fails if an unexpected error occurs', function () {
//     return jasmine.withGlobalErrorSpy(function (globalErrorSpy) {
//       setTimeout(function () {
//         throw new Error('nope')
//       });
//
//       return new Promise(function (resolve) {
//         setTimeout(resolve);
//       });
//     });
//   });
// });



// Async variant (same implementation as promise):
// describe('GlobalErrorSpy', function () {
//   it('passes if all expected errors occur', async function () {
//     await jasmine.withGlobalErrorSpy(async function (globalErrorSpy) {
//       setTimeout(function () {
//         throw new Error('nope')
//       });
//       setTimeout(function () {
//         throw new Error('nor this either')
//       });
//
//       await new Promise(function(resolve) {
//         setTimeout(resolve);
//       });
//
//       env.expect(globalErrorSpy).toHaveReceivedGlobalError('nor this either');
//       env.expect(globalErrorSpy).toHaveReceivedGlobalError('nope');
//     });
//   });
//
//   it('fails if any expected error does not occur', async function () {
//     await jasmine.withGlobalErrorSpy(async function (globalErrorSpy) {
//       env.expect(globalErrorSpy).toHaveReceivedGlobalError('nope');
//     });
//   });
//
//   it('fails if an unexpected error occurs', async function() {
//     await jasmine.withGlobalErrorSpy(async function (globalErrorSpy) {
//       setTimeout(function () {
//         throw new Error('nope')
//       });
//
//       await new Promise(function (resolve) {
//         setTimeout(resolve);
//       });
//     });
//   });
// });
//
//

// Sync variant, fully IE compatible:
// describe('GlobalErrorSpy', function () {
//   it('passes if all expected errors occur', function (done) {
//     var globalErrorSpy = env.spyOnGlobalErrors();
//
//     setTimeout(function () {
//       throw new Error('nope')
//     });
//
//     setTimeout(function () {
//       throw new Error('nor this either')
//     });
//
//     setTimeout(function() {
//       env.expect(globalErrorSpy).toHaveReceivedGlobalError('nor this either');
//       env.expect(globalErrorSpy).toHaveReceivedGlobalError('nope');
//       done();
//     });
//   });
//
//   it('fails if any expected error does not occur', function () {
//     var globalErrorSpy = env.spyOnGlobalErrors();
//     env.expect(globalErrorSpy).toHaveReceivedGlobalError('nope');
//   });
//
//   it('fails if an unexpected error occurs', function() {
//     var globalErrorSpy = env.spyOnGlobalErrors();
//
//     setTimeout(function () {
//       throw new Error('nope')
//     });
//
//     setTimeout(done);
//   });
// });
