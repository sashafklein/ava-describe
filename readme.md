# AVA Describe

A very lightweight library built to allow for nested testing in [AVA](https://github.com/avajs/ava) with injected variables by context. Other libraries exist for this (including many JavaScript testing libraries that aren't AVA), but I just wanted to make one that was simple and used a brief and straighforward object syntax.

The library has two exported functions, `describe` and `cb` (essentially, `describe`, but for `test.cb`, when you need to let a test run a callback). Each takes a top-level descriptor string, and then a test object, which can be infinitely nestable. Each object down the tree can define a `before` attribute, which is an object of variables passed into the test as a second argument. Each `before` object overwrites any conflicting keys in `before` objects further up the tree:

```
import { describe } from 'ava-describe';

describe('Some functionality', {
  before: { forAllTests: 'someValue' },
  'when nested': {
     before: { forTestsBelow: 'someOtherValue' },
     'it has access to all vars up the chain': (t, vars) => {
        t.is(vars.forAllTests, 'someValue');
        t.is(vars.forTestsBelow, 'someOtherValue');
     }
  },
  'it has no access to lower level vars': (t, vars) => {
     t.is(vars.forAllTests, 'someValue');
     t.is(vars.forTestsBelow, undefined);
  }
});
```

This stitches the descriptions together to produce the following output:

```
✔ Some functionality - when nested - it has access to all vars up the chain
✔ Some functionality - it has no access to lower level vars
```

In addition, to make tests easier to read and write, test descriptors can be written as camel-cased keys, which will be converted into spaced strings. Consequently, the above will show identical output to the below:

```
describe('Some functionality', {
  before: { forAllTests: 'someValue' },
  whenNested: {
     before: { forTestsBelow: 'someOtherValue' },
     itHasAccessToAllVarsUpTheChain: (t, vars) => {
        t.is(vars.forAllTests, 'someValue');
        t.is(vars.forTestsBelow, 'someOtherValue');
     }
  },
  itHasNoAccessToLowerLevelVars: (t, vars) => {
     t.is(vars.forAllTests, 'someValue');
     t.is(vars.forTestsBelow, undefined);
  }
});
```

Using ES6 desctructuring and object shorthand, this can be further simplified (or at least decomposed) like so:

```
const itHasAccessToAllVarsUpTheChain = (t, { forAllTests, forTestsBelow }) => {
  t.is(forAllTests, 'someValue');
  t.is(forTestsBelow, 'someOtherValue');
};

const itHasNoAccessToLowerLevelVars = (t, { forAllTests, forTestsBelow }) => {
  t.is(forAllTests, 'someValue');
  t.is(forTestsBelow, undefined);
};

describe('Some functionality', {
  before: { forAllTests: 'someValue' },
  whenNested: {
     before: { forTestsBelow: 'someOtherValue' },
     itHasAccessToAllVarsUpTheChain
  },
  itHasNoAccessToLowerLevelVars
});
```

### TODO

- Come up with a non-confusing syntax for before *functions*, which can return var objects after performing an action which might have side effects.