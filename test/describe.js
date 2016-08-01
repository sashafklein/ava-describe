import { describe, cb } from '../src/describe';

describe('basic behavior', {
  before: {
    one: 1,
    three: 3,
    two: 2
  },
  'top level': {
    before: {
      three: 1000,
      four: 4
    },
    'im am a test': (t, vars) => {
      t.deepEqual(vars, {
        one: 1,
        two: 2,
        three: 1000,
        four: 4
      })
    },
    'and I nest even further': {
      before: {
        four: 'hello',
        five: 5
      },
      'final test': (t, { one, two, three, four, five }) => {
        t.is(one, 1);
        t.is(two, 2);
        t.is(three, 1000);
        t.is(four, 'hello');
        t.is(five, 5);
        t.is(one + two, 3);
      }
    }
  },
  'i am un-nested': (t, vars) => {
    t.deepEqual(vars, { one: 1, three: 3, two: 2 });
  }
});

const variablesAreSummable = (t, { one, two, three }) => { t.is(one + two + three, 6); };
const variablesAreMultipliable = (t, { one, two, three }) => { t.is(one + two + three, 6); };

describe('abbreviated format behavior', {
  'auto splitting of camel cased test functions': {
    before: {
      one: 1,
      two: 2,
      three: 3
    },
    variablesAreMultipliable,
    variablesAreSummable,
    testsCanBeNested: {
      before: { four: 4 },
      andHaveNewVariables: (t, { one, two, three, four }) => { t.is(one + two, + three, + four, 10)}
    }
  }
})

cb('callback functionality', {
  'it works unnested': t => {
    setTimeout(() => {
      t.pass();
      t.end();
    }, 500)
  },
  asWellAsNested: {
    before: { five: 5 },
    withVariables: (t, { five }) => {
      setTimeout(() => {
        t.is(five, 5);
        t.end();
      }, 500);
    }
  }
})

describe('without any before stuff', {
  worksWithOneTest: t => { t.pass(); },
  worksWithNestedTests: {
    likeThis: t => { t.pass(); }
  }
});