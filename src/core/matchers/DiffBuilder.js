getJasmineRequireObj().DiffBuilder = function (j$) {
  return function DiffBuilder(config) {
    var prettyPrinter = (config || {}).prettyPrinter || j$.makePrettyPrinter(),
      mismatches = new j$.MismatchTree(),
      path = new j$.ObjectPath(),
      actualRoot = undefined,
      expectedRoot = undefined;

    return {
      setRoots: function (actual, expected) {
        actualRoot = actual;
        expectedRoot = expected;
      },

      recordMismatch: function (formatter) {
        console.log("Adding mismatch at path", path.components);
        mismatches.add(path, formatter || defaultFormatter);
      },

      getMessage: function () {
        var messages = [];

        mismatches.traverse(function (path, isLeaf, formatter) {
          console.log("traverse(", path.components, ",", isLeaf, ",", formatter);
          var actualCustom, expectedCustom, useCustom,
            actual = path.dereference(actualRoot),
            expected = path.dereference(expectedRoot);

          if (formatter) {
            console.log("Using specified formatter at", path.components, ":", formatter)
            messages.push(formatter(actual, expected, path, prettyPrinter));
            return true;
          }

          console.log("!formatter, leaf:", isLeaf);

          actualCustom = prettyPrinter.customFormat_(actual);
          expectedCustom = prettyPrinter.customFormat_(expected);
          useCustom = !(j$.util.isUndefined(actualCustom) && j$.util.isUndefined(expectedCustom));

          if (useCustom) {
            console.log("Using custom at", path.components, "(formatter =", formatter, ")")
            messages.push(wrapPrettyPrinted(actualCustom, expectedCustom, path));
            return false; // don't recurse further
          }

          if (isLeaf) {
            throw new Error('leaf yo')
            messages.add(defaultFormatter(actual, expected, path, prettyPrinter));
          }

          return true;
        });

        return messages.join('\n');
      },

      withPath: function (pathComponent, block) {
        var oldPath = path;
        path = path.add(pathComponent);
        block();
        path = oldPath;
      }
    };

    function defaultFormatter(actual, expected, path, prettyPrinter) {
      return wrapPrettyPrinted(prettyPrinter(actual), prettyPrinter(expected), path);
    }

    function wrapPrettyPrinted(actual, expected, path) {
      return 'Expected ' +
        path + (path.depth() ? ' = ' : '') +
        actual +
        ' to equal ' +
        expected +
        '.';
    }
  };
};
