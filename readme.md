# AVA Describe

A very lightweight library built to allow for nested testing in [AVA](https://github.com/avajs/ava) with injected variables by context. Other libraries exist for this (including many JavaScript testing libraries that aren't AVA), but I just wanted to make one that was simple and used a brief and straighforward object syntax.

The library has two exported functions, `describe` and `cb` (essentially, `describe`, but for `test.cb`, when you need to let a test run a callback). Each takes a top-level descriptor string, and then a test object, which can be infinitely nestable. Each object down the tree can define a `before` attribute, which is an object of variables passed into the test as a second argument. Ecah `before` object overwrites any conflicting keys in `before` objects further up the tree:

```
describe('Some functionality', {
  before: { variableForAllTests: 'someValue' },
  'when nested': {
     before: { variableForTestsBelowThis: 'someOtherValue' },
     'it has access to all vars up the chain': (t, vars) => {
        t.is(vars.variableForAllTests, 'someValue');
        t.is(vars.variableForTestsBelowThis, 'someOtherValue');
     }
  },
  'it has no access to lower level vars': (t, vars) => {
     t.is(vars.variableForAllTests, 'someValue');
     t.is(vars.variableForTestsBelowThis, undefined);
  }
});
```

In addition, to make tests easier to read and write, test descriptors can be written as camel-cased keys, which will be converted into spaced strings. Consequently, the above will show identical output to the below:

```
describe('Some functionality', {
  before: { variableForAllTests: 'someValue' },
  whenNested: {
     before: { variableForTestsBelowThis: 'someOtherValue' },
     itHasAccessToAllVarsUpTheChain: (t, vars) => {
        t.is(vars.variableForAllTests, 'someValue');
        t.is(vars.variableForTestsBelowThis, 'someOtherValue');
     }
  },
  itHasNoAccessToLowerLevelVars: (t, vars) => {
     t.is(vars.variableForAllTests, 'someValue');
     t.is(vars.variableForTestsBelowThis, undefined);
  }
});
```

Using ES6 deconstruction, this can be further simplified (or at least decomposed) like so:

```
const itHasAccessToAllVarsUpTheChain = (t, vars) => {
  t.is(vars.variableForAllTests, 'someValue');
  t.is(vars.variableForTestsBelowThis, 'someOtherValue');
};

const itHasNoAccessToLowerLevelVars = (t, vars) => {
  t.is(vars.variableForAllTests, 'someValue');
  t.is(vars.variableForTestsBelowThis, undefined);
};

describe('Some functionality', {
  before: { variableForAllTests: 'someValue' },
  whenNested: {
     before: { variableForTestsBelowThis: 'someOtherValue' },
     itHasAccessToAllVarsUpTheChain
  },
  itHasNoAccessToLowerLevelVars
});
```
