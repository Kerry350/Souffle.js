Souffle.js
==========

Soufflé is a validation library. 

Carrying on with the dessert theme, after VictoriaSponge, this is named Soufflé due to it being considered one of the hardest desserts to make. Therefore it *validates* dessert makers as being skilled. Get it, get it?! :)

## How to use

There are two ways to use Souffle.js, you can either use the chainable API or pass in an object to be validated along with a 'ruleset'. The examples below show both in use. 

### Chainable API

With the chainable API you just need to call `Souffle`, passing in a singular value. You can then chain as many validations as you like, when you're done and want the errors (if any) just call `.exec()`. e.g.

`var errors = Souffle(23).minValue(10).maxValue(20).exec();`

This will return an array of error objects, in this case:

```
  [{message: "23 must be less than 20"}];
```

**I plan to make the error handling a little more robust next** (better messages on certain validations, particularly with the ruleset mode)

### Ruleset API

With the ruleset API you call `Souffle()` with an object to validate against and an object containing the rules to use. Let's look at an example as it's a little clearer:

```
var values = {
    name: 'Magical Donkey',
    email: 'magical_donkey@narnia.com',
    age: 15,
    owner: {
      firstName: 100, 
      address: {
        street: '',
        city: ''
      },
      lastName: ''
    }
};

var ruleset = {
    name: {
      isString: true
    },
  
    email: {
      isEmail: true
    },

    age: {
      minValue: 100
    },
    
    owner: {
      firstName: {
        isString: true
      },
      address: {
        street: {
          isNotBlank: true
        },
        city: {
          isNotBlank: true
        }
      },
      lastName: {
        isNotBlank: true
      }
    }
};

var errors = Souffle(values, ruleset);

```

This returns us an array containing 6 error objects. 

As you've probably guessed you just need to make sure your ruleset properties match the names of the properties within the values object. This works with nested objects too, as with owner and owner.address in the example. 

## Available validations

- `isNumber`
- `isArray`
- `isString`
- `isEmail`
- `isURL`
- `matches`
- `isNotBlank`
- `minValue`
- `maxValue`

**These are just the ones I've finished so far, there's more to come.**