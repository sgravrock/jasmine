jasmineRequire.toHaveClass = function() {
  /**
   * {@link expect} the actual value to be a DOM element that has the expected class
   * @function
   * @name matchers#toHaveClass
   * @param {Object} expected - The class name to test for
   * @example
   * var el = document.createElement('div');
   * el.className = 'foo bar baz';
   * expect(el).toHaveClass('bar');
   */
  function toHaveClass() {
    return {
      compare: function(actual, expected) {
        return {
          pass: actual.classList.contains(expected)
        };
      }
    };
  }

  return toHaveClass;
};
