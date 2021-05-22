// TODO: Fix these unit tests!
describe('Env', function() {
  var env;
  beforeEach(function() {
    env = new jasmineUnderTest.Env();
  });

  afterEach(function() {
    env.cleanup_();
  });

  describe('#pending', function() {
    it('throws the Pending Spec exception', function() {
      expect(function() {
        env.pending();
      }).toThrow(jasmineUnderTest.Spec.pendingSpecExceptionMessage);
    });

    it('throws the Pending Spec exception with a custom message', function() {
      expect(function() {
        env.pending('custom message');
      }).toThrow(
        jasmineUnderTest.Spec.pendingSpecExceptionMessage + 'custom message'
      );
    });
  });

  describe('#topSuite', function() {
    it('returns an object that describes the tree of suites and specs', function() {
      var suite;
      spyOn(env, 'deprecated');

      env.it('a top level spec');
      env.describe('a suite', function() {
        env.it('a spec');
        env.describe('a nested suite', function() {
          env.it('a nested spec');
        });
      });

      suite = env.topSuite();
      expect(suite.description).toEqual('Jasmine__TopLevel__Suite');
      expect(suite.getFullName()).toEqual('');
      expect(suite.children.length).toEqual(2);

      expect(suite.children[0].description).toEqual('a top level spec');
      expect(suite.children[0].getFullName()).toEqual('a top level spec');
      expect(suite.children[0].children).toBeFalsy();

      expect(suite.children[1].description).toEqual('a suite');
      expect(suite.children[1].getFullName()).toEqual('a suite');
      expect(suite.children[1].parentSuite).toBe(suite);
      expect(suite.children[1].children.length).toEqual(2);

      expect(suite.children[1].children[0].description).toEqual('a spec');
      expect(suite.children[1].children[0].getFullName()).toEqual(
        'a suite a spec'
      );
      expect(suite.children[1].children[0].children).toBeFalsy();

      expect(suite.children[1].children[1].description).toEqual(
        'a nested suite'
      );
      expect(suite.children[1].children[1].getFullName()).toEqual(
        'a suite a nested suite'
      );
      expect(suite.children[1].children[1].parentSuite).toBe(suite.children[1]);
      expect(suite.children[1].children[1].children.length).toEqual(1);

      expect(suite.children[1].children[1].children[0].description).toEqual(
        'a nested spec'
      );
      expect(suite.children[1].children[1].children[0].getFullName()).toEqual(
        'a suite a nested suite a nested spec'
      );
      expect(suite.children[1].children[1].children[0].children).toBeFalsy();
    });

    it('does not deprecate access to public Suite and Spec members', function() {
      jasmine.getEnv().requireProxy();
      var suite;
      spyOn(env, 'deprecated');

      env.it('a top level spec');
      env.describe('a suite', function() {
        env.it('a spec');
      });

      suite = env.topSuite();
      suite.description;
      suite.getFullName();
      suite.children;
      suite.parentSuite;
      suite.children[0].description;
      suite.children[0].getFullName();
      suite.children[0].children;

      suite.children[1].description;
      suite.children[1].getFullName();
      suite.children[1].parentSuite;
      suite.children[1].children;

      expect(env.deprecated).not.toHaveBeenCalled();
    });

    it('deprecates access to internal Suite and Spec members', function() {
      jasmine.getEnv().requireProxy();
      var topSuite, expectationFactory, spec;

      env.it('a top level spec');
      spyOn(env, 'deprecated');
      topSuite = env.topSuite();

      topSuite.expectationFactory;
      expect(env.deprecated).toHaveBeenCalledWith(
        'Access to private Suite ' +
          'members (in this case `expectationFactory`) via Env#topSuite is ' +
          'not supported and will break in a future release. See ' +
          '<https://jasmine.github.io/api/edge/Suite.html> for correct usage.'
      );
      env.deprecated.calls.reset();

      topSuite.expectationFactory = expectationFactory;
      expect(env.deprecated).toHaveBeenCalledWith(
        'Access to private Suite ' +
          'members (in this case `expectationFactory`) via Env#topSuite is ' +
          'not supported and will break in a future release. See ' +
          '<https://jasmine.github.io/api/edge/Suite.html> for correct usage.'
      );

      topSuite.status();
      expect(env.deprecated).toHaveBeenCalledWith(
        'Access to private Suite ' +
          'members (in this case `status`) via Env#topSuite is ' +
          'not supported and will break in a future release. See ' +
          '<https://jasmine.github.io/api/edge/Suite.html> for correct usage.'
      );

      spec = topSuite.children[0];
      spec.pend();
      expect(env.deprecated).toHaveBeenCalledWith(
        'Access to private Spec ' +
          'members (in this case `pend`) via Env#topSuite ' +
          'is not supported and will break in a future release. See ' +
          '<https://jasmine.github.io/api/edge/Spec.html> for correct usage.'
      );

      expectationFactory = spec.expectationFactory;
      expect(env.deprecated).toHaveBeenCalledWith(
        'Access to private Spec ' +
          'members (in this case `expectationFactory`) via Env#topSuite ' +
          'is not supported and will break in a future release. See ' +
          '<https://jasmine.github.io/api/edge/Spec.html> for correct usage.'
      );
      env.deprecated.calls.reset();

      spec.expectationFactory = expectationFactory;
      expect(env.deprecated).toHaveBeenCalledWith(
        'Access to private Spec ' +
          'members (in this case `expectationFactory`) via Env#topSuite ' +
          'is not supported and will break in a future release. See ' +
          '<https://jasmine.github.io/api/edge/Spec.html> for correct usage.'
      );
    });
  });

  it('accepts its own current configureation', function() {
    env.configure(env.configuration());
  });

  it('can configure specs to throw errors on expectation failures', function() {
    env.configure({ oneFailurePerSpec: true });

    spyOn(jasmineUnderTest, 'Spec');
    env.it('foo', function() {});
    expect(jasmineUnderTest.Spec).toHaveBeenCalledWith(
      jasmine.objectContaining({
        throwOnExpectationFailure: true
      })
    );
  });

  it('can configure suites to throw errors on expectation failures', function() {
    env.configure({ oneFailurePerSpec: true });

    spyOn(jasmineUnderTest, 'Suite');
    env.describe('foo', function() {});
    expect(jasmineUnderTest.Suite).toHaveBeenCalledWith(
      jasmine.objectContaining({
        throwOnExpectationFailure: true
      })
    );
  });

  describe('promise library', function() {
    it('can be configured without a custom library', function() {
      env.configure({});
      env.configure({ Promise: undefined });
    });

    it('can be configured with a custom library', function() {
      var myLibrary = {
        resolve: jasmine.createSpy(),
        reject: jasmine.createSpy()
      };
      env.configure({ Promise: myLibrary });
    });

    it('cannot be configured with an invalid promise library', function() {
      var myLibrary = {};

      expect(function() {
        env.configure({ Promise: myLibrary });
      }).toThrowError(
        'Custom promise library missing `resolve`/`reject` functions'
      );
    });
  });

  it('defaults to multiple failures for specs', function() {
    spyOn(jasmineUnderTest, 'Spec');
    env.it('bar', function() {});
    expect(jasmineUnderTest.Spec).toHaveBeenCalledWith(
      jasmine.objectContaining({
        throwOnExpectationFailure: false
      })
    );
  });

  it('defaults to multiple failures for suites', function() {
    spyOn(jasmineUnderTest, 'Suite');
    env.describe('foo', function() {});
    expect(jasmineUnderTest.Suite).toHaveBeenCalledWith(
      jasmine.objectContaining({
        throwOnExpectationFailure: false
      })
    );
  });

  describe('#describe', function() {
    it('throws an error when given arguments', function() {
      expect(function() {
        env.describe('done method', function(done) {});
      }).toThrowError('describe does not expect any arguments');
    });

    it('throws an error when it receives a non-fn argument', function() {
      // Some versions of PhantomJS return [object DOMWindow] when
      // Object.prototype.toString.apply is called with `undefined` or `null`.
      // In a similar fashion, IE8 gives [object Object] for both `undefined`
      // and `null`. We mostly just want these tests to check that using
      // anything other than a function throws an error.
      expect(function() {
        env.describe('undefined arg', undefined);
      }).toThrowError(
        /describe expects a function argument; received \[object (Undefined|DOMWindow|Object)\]/
      );
      expect(function() {
        env.describe('null arg', null);
      }).toThrowError(
        /describe expects a function argument; received \[object (Null|DOMWindow|Object)\]/
      );

      expect(function() {
        env.describe('array arg', []);
      }).toThrowError(
        'describe expects a function argument; received [object Array]'
      );
      expect(function() {
        env.describe('object arg', {});
      }).toThrowError(
        'describe expects a function argument; received [object Object]'
      );

      expect(function() {
        env.describe('fn arg', function() {
          env.it('has a spec', function() {});
        });
      }).not.toThrowError(
        'describe expects a function argument; received [object Function]'
      );
    });

    it('throws an error when it has no children', function() {
      expect(function() {
        env.describe('done method', function() {});
      }).toThrowError('describe with no children (describe() or it())');
    });
  });

  describe('#it', function() {
    it('throws an error when it receives a non-fn argument', function() {
      expect(function() {
        env.it('undefined arg', null);
      }).toThrowError(
        /it expects a function argument; received \[object (Null|DOMWindow|Object)\]/
      );
    });

    it('does not throw when it is not given a fn argument', function() {
      expect(function() {
        env.it('pending spec');
      }).not.toThrow();
    });

    it('accepts an async function', function() {
      jasmine.getEnv().requireAsyncAwait();
      expect(function() {
        env.it('async', jasmine.getEnv().makeAsyncAwaitFunction());
      }).not.toThrow();
    });
  });

  describe('#xit', function() {
    it('calls spec.pend with "Temporarily disabled with xit"', function() {
      var pendSpy = jasmine.createSpy();
      spyOn(env, 'it').and.returnValue({
        pend: pendSpy
      });
      env.xit('foo', function() {});
      expect(pendSpy).toHaveBeenCalledWith('Temporarily disabled with xit');
    });

    it('throws an error when it receives a non-fn argument', function() {
      expect(function() {
        env.xit('undefined arg', null);
      }).toThrowError(
        /xit expects a function argument; received \[object (Null|DOMWindow|Object)\]/
      );
    });

    it('does not throw when it is not given a fn argument', function() {
      expect(function() {
        env.xit('pending spec');
      }).not.toThrow();
    });

    it('accepts an async function', function() {
      jasmine.getEnv().requireAsyncAwait();
      expect(function() {
        env.xit('async', jasmine.getEnv().makeAsyncAwaitFunction());
      }).not.toThrow();
    });
  });

  describe('#fit', function() {
    it('throws an error when it receives a non-fn argument', function() {
      expect(function() {
        env.fit('undefined arg', undefined);
      }).toThrowError(
        /fit expects a function argument; received \[object (Undefined|DOMWindow|Object)\]/
      );
    });
  });

  describe('#beforeEach', function() {
    it('throws an error when it receives a non-fn argument', function() {
      expect(function() {
        env.beforeEach(undefined);
      }).toThrowError(
        /beforeEach expects a function argument; received \[object (Undefined|DOMWindow|Object)\]/
      );
    });

    it('accepts an async function', function() {
      jasmine.getEnv().requireAsyncAwait();
      expect(function() {
        env.beforeEach(jasmine.getEnv().makeAsyncAwaitFunction());
      }).not.toThrow();
    });
  });

  describe('#beforeAll', function() {
    it('throws an error when it receives a non-fn argument', function() {
      expect(function() {
        env.beforeAll(undefined);
      }).toThrowError(
        /beforeAll expects a function argument; received \[object (Undefined|DOMWindow|Object)\]/
      );
    });

    it('accepts an async function', function() {
      jasmine.getEnv().requireAsyncAwait();
      expect(function() {
        env.beforeAll(jasmine.getEnv().makeAsyncAwaitFunction());
      }).not.toThrow();
    });
  });

  describe('#afterEach', function() {
    it('throws an error when it receives a non-fn argument', function() {
      expect(function() {
        env.afterEach(undefined);
      }).toThrowError(
        /afterEach expects a function argument; received \[object (Undefined|DOMWindow|Object)\]/
      );
    });

    it('accepts an async function', function() {
      jasmine.getEnv().requireAsyncAwait();
      expect(function() {
        env.afterEach(jasmine.getEnv().makeAsyncAwaitFunction());
      }).not.toThrow();
    });
  });

  describe('#afterAll', function() {
    it('throws an error when it receives a non-fn argument', function() {
      expect(function() {
        env.afterAll(undefined);
      }).toThrowError(
        /afterAll expects a function argument; received \[object (Undefined|DOMWindow|Object)\]/
      );
    });

    it('accepts an async function', function() {
      jasmine.getEnv().requireAsyncAwait();
      expect(function() {
        env.afterAll(jasmine.getEnv().makeAsyncAwaitFunction());
      }).not.toThrow();
    });
  });

  describe('#deprecatedOnceWithStack', function() {
    it('includes a stack trace', function() {
      spyOn(env, 'deprecated');

      env.deprecatedOnceWithStack('msg');

      expect(env.deprecated).toHaveBeenCalled();
      var msg = env.deprecated.calls.argsFor(0)[0];
      expect(msg).toContain('msg');
      expect(msg).toContain('EnvSpec.js');
      expect(msg).not.toContain('Error');
    });

    describe('When verboseDeprecations is true', function() {
      it('calls #deprecated every time', function() {
        env.configure({ verboseDeprecations: true });
        spyOn(env, 'deprecated');

        env.deprecatedOnceWithStack('msg');
        env.deprecatedOnceWithStack('msg');
        expect(env.deprecated).toHaveBeenCalledWith(
          jasmine.stringMatching(/msg/)
        );
        expect(env.deprecated).toHaveBeenCalledTimes(2);
        expect(env.deprecated).not.toHaveBeenCalledWith(
          jasmine.stringMatching(/only once/)
        );
      });
    });

    describe('When verboseDeprecations is false', function() {
      it('calls #deprecated once per unique message', function() {
        env.configure({ verboseDeprecations: false });
        spyOn(env, 'deprecated');

        env.deprecatedOnceWithStack('foo');
        env.deprecatedOnceWithStack('bar');
        env.deprecatedOnceWithStack('foo');

        expect(env.deprecated).toHaveBeenCalledWith(
          jasmine.stringMatching(
            /foo\nNote: This message will be shown only once. Set config.verboseDeprecations to true to see every occurrence/m
          )
        );
        expect(env.deprecated).toHaveBeenCalledWith(
          jasmine.stringMatching(
            /bar\nNote: This message will be shown only once. Set config.verboseDeprecations to true to see every occurrence/m
          )
        );
        expect(env.deprecated).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('when not constructed with suppressLoadErrors: true', function() {
    it('installs a global error handler on construction', function() {
      var globalErrors = jasmine.createSpyObj('globalErrors', [
        'install',
        'uninstall',
        'pushListener',
        'popListener'
      ]);
      spyOn(jasmineUnderTest, 'GlobalErrors').and.returnValue(globalErrors);
      env.cleanup_();
      env = new jasmineUnderTest.Env();
      expect(globalErrors.install).toHaveBeenCalled();
    });
  });

  describe('when constructed with suppressLoadErrors: true', function() {
    it('does not install a global error handler until execute is called', function() {
      var globalErrors = jasmine.createSpyObj('globalErrors', [
        'install',
        'uninstall',
        'pushListener',
        'popListener'
      ]);
      spyOn(jasmineUnderTest, 'GlobalErrors').and.returnValue(globalErrors);
      env.cleanup_();
      env = new jasmineUnderTest.Env({ suppressLoadErrors: true });
      expect(globalErrors.install).not.toHaveBeenCalled();
      env.execute();
      expect(globalErrors.install).toHaveBeenCalled();
    });
  });

  it('creates an expectationFactory that uses the current custom equality testers and object formatters', function(done) {
    function customEqualityTester() {}
    function customObjectFormatter() {}
    function prettyPrinter() {}
    var RealSpec = jasmineUnderTest.Spec,
      specInstance,
      expectationFactory;
    spyOn(jasmineUnderTest, 'MatchersUtil');
    spyOn(jasmineUnderTest, 'makePrettyPrinter').and.returnValue(prettyPrinter);
    spyOn(jasmineUnderTest, 'Spec').and.callFake(function(options) {
      expectationFactory = options.expectationFactory;
      specInstance = new RealSpec(options);
      return specInstance;
    });

    env.it('spec', function() {
      env.addCustomEqualityTester(customEqualityTester);
      env.addCustomObjectFormatter(customObjectFormatter);
      expectationFactory('actual', specInstance);
    });

    env.execute(null, function() {
      expect(jasmineUnderTest.makePrettyPrinter).toHaveBeenCalledWith([
        customObjectFormatter
      ]);
      expect(jasmineUnderTest.MatchersUtil).toHaveBeenCalledWith({
        customTesters: [customEqualityTester],
        pp: prettyPrinter
      });
      done();
    });
  });

  it('creates an asyncExpectationFactory that uses the current custom equality testers and object formatters', function(done) {
    function customEqualityTester() {}
    function customObjectFormatter() {}
    function prettyPrinter() {}
    var RealSpec = jasmineUnderTest.Spec,
      specInstance,
      asyncExpectationFactory;
    spyOn(jasmineUnderTest, 'MatchersUtil');
    spyOn(jasmineUnderTest, 'makePrettyPrinter').and.returnValue(prettyPrinter);
    spyOn(jasmineUnderTest, 'Spec').and.callFake(function(options) {
      asyncExpectationFactory = options.asyncExpectationFactory;
      specInstance = new RealSpec(options);
      return specInstance;
    });

    env.it('spec', function() {
      env.addCustomEqualityTester(customEqualityTester);
      env.addCustomObjectFormatter(customObjectFormatter);
      asyncExpectationFactory('actual', specInstance);
    });

    env.execute(null, function() {
      expect(jasmineUnderTest.makePrettyPrinter).toHaveBeenCalledWith([
        customObjectFormatter
      ]);
      expect(jasmineUnderTest.MatchersUtil).toHaveBeenCalledWith({
        customTesters: [customEqualityTester],
        pp: prettyPrinter
      });
      done();
    });
  });

  it("does not expose the suite as 'this'", function() {
    var suiteThis;
    spyOn(env, 'deprecated');

    env.describe('a suite', function() {
      suiteThis = this;
      env.it('has a spec');
    });

    expect(suiteThis).not.toBeInstanceOf(jasmineUnderTest.Suite);
  });
});
