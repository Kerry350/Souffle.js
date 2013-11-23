(function(root) {

  /* 
    Two APIs, one for validating entire objects against a set of rules. Another for direct validations with a chainable API.
  */

  // Validations will return false if failed, and true if they pass
  validations = {
    isNumber: {
      fn: function(val) {
        return typeof val === 'number';
      },
      error: function(val) {
        return {message: 'Not a number'};
      }
    },

    isArray: {
      fn: function(val) {
        if (Array.isArray) {
          return Array.isArray(val);
        }

        // IE < 9
        else {
          return Object.prototype.toString.call(val) === "[object Array]";
        }
      },
      error: function(val) {
        return {message: 'Not an array'};
      }
    },

    isString: {
      fn: function(val) {
        return typeof val === 'string';
      },
      error: function(val) {
        return {message: 'Not a string'};
      }
    },

    isEmail: {
      fn: function(val) {
        // http://regexlib.com/REDetails.aspx?regexp_id=2119
        var regex = '^([a-zA-Z0-9]+([\.+_-][a-zA-Z0-9]+)*)@(([a-zA-Z0-9]+((\.|[-]{1,2})[a-zA-Z0-9]+)*)\.[a-zA-Z]{2,6})$';
        return val.match(regex);
      },
      error: function(val) {
        return {message: 'Not a valid email address'};
      }
    },

    isURL: {
      fn: function(val) {
        // http://regexlib.com/REDetails.aspx?regexp_id=3088
        var regex = '^((http:\/\/www\.)|(www\.)|(http:\/\/))[a-zA-Z0-9._-]+\.[a-zA-Z.]{2,5}$';
        return val.match(regex);
      },
      error: function(val) {
        return {message: 'Not a valid URL'};
      }
    },

    matches: {
      fn: function(val, regex) {
        return val.match(regex);
      },
      error: function(val, regex) {
        return {message: 'Does not match the provided regular expression'};
      }
    },

    isNotBlank: {
      fn: function(val) {
        return val.trim().length > 0 ? true : false;
      },
      error: function(val) {
        return {message: 'Cannot be blank'};
      }
    },

    length: {
      fn: function() {

      },
      error: function(val) {

      }
    },

    minLength: {
      fn: function(val, min) {
        return val >= min;
      },
      error: function(val, min) {
        return {message: val + ' must be more than ' + min};
      }
    },

    maxLength: {
      fn: function(val, max) {
        return val <= max;
      },
      error: function(val, max) {
        return {message: val + ' must be less than ' + max};
      }
    },

    // IE >= 9
    minKeys: {
      fn: function() {

      },
      error: function(val) {

      }
    },

    contains: {
      fn: function() {

      },
      error: function(val) {

      } 
    }
  };


  var Souffle = function(values, rules) {
    if (!(this instanceof Souffle)) {
      return new Souffle(values, rules);
    }

    if (!values && !rules) {
      throw new Error('Souffle.js: Please either provide an object and corresponding ruleset, or a value');
    }

    if ((values && typeof values === 'object') && (rules && typeof rules === 'object')) {
      this.errors = [];
      this.validateRuleset(values, rules, this.errors);
      return this.errors;
    }

    else {
      this.errors = [];
      this.value = values;
      return this;
    }
  };

  Souffle.prototype = {
    validateRuleset: function(values, rules, errors) {
  
      for (var key in rules) {
        
        var value = values[key];

        // Object and NOT an array
        if (typeof value === 'object') {
          this.validateRuleset(value, rules[key], errors);
          continue; // Don't bother looping these rules, it's taken care of by the recursive call
        }

        for (var rule in rules[key]) {
         
          var expectedOutcome = rules[key][rule];

          // If we've been given a boolean to test against we'll see if the validation function returns the same boolean result
          if (typeof expectedOutcome === 'boolean') {
            try {
              if (validations[rule].fn(value) !== expectedOutcome) {
                errors.push(validations[rule].error(value))    
              }
            } catch(e) {
              errors.push(validations[rule].error(value))
            }
          }

          // if we've been given a value (like 10 for minLength etc) we're testing to see if the validation function returns true (thus passes)
          else {
            try {
              if (!validations[rule].fn(value, expectedOutcome)) {
                errors.push(validations[rule].error(value, expectedOutcome));
              }
            } catch(e) {
              errors.push(validations[rule].error(value, expectedOutcome));
            }
          }
        }
      }
    },

    exec: function() {
      return this.errors;
    }
  };

  // Add all of the validation checks to the Souffle prototype, allows us the flexibility to use two APIs
  for (var key in validations) {
    if (validations.hasOwnProperty(key)) {
      // Within an IIFE so we have the correct reference to 'key'
      (function(key) {
        Souffle.prototype[key] = function() {
          var args = Array.prototype.slice.call(arguments);
          args.unshift(this.value);
          if (!validations[key].fn.apply(null, args)) {
            this.errors.push(validations[key].error.apply(null, args))
          }
          
          return this;
        };
      })(key);
    }
  }

  root.Souffle = Souffle;

})(window);