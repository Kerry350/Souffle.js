(function(root) {

  /* 

    Two APIs, one for validating entire objects against a set of rules. Another for direct validations.

    Rule object: 

      Souffle({
        name: 'Magical Donkey', 
        age: 15,
        owner: {
          firstName: 'Magic', 
          lastName: 'Dave'
        }
      },

      {
        name: {
          isString: true, 
          minLength: 10, 
          maxLength: 20
        },

        age: {
          isNotBlank: true
        },

        owner: {
          firstName: {
            isNotBlank: true
          },
          lastName: {
            isNotBlank: true
          }
        }
      }); // Returns an errors array

      Souffle('Donkey').isString().length(5, 10).exec();
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
        
      },
      error: function(val) {

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
      fn: function() {

      },
      error: function(val) {

      }
    },

    maxLength: {
      fn: function() {

      },
      error: function(val) {

      }
    },

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
      throw new Error('Please either provide an object and corresponding ruleset, or a value');
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

    },

    exec: function() {
      return this.errors;
    }
  };

  // Add all of the validation checks to the Souffle prototype
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