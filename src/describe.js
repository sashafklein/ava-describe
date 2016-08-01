import _ from 'lodash';
import test from 'ava';

const del = (obj, key) => {
  const val = obj[key];
  delete obj[key];
  return val;
};

class Describer {
  constructor(description, testObject, callback = false) {
    this.desc = description;
    this.testObject = this.recursivelyFlatten(testObject);
    this.callback = callback
  }

  runTests() {
    _.keys(this.testObject).forEach(key => {
      const example = this.testObject[key];
      const testFunc = example[0];
      const beforeVars = example[1];

      if (this.callback) {
        test.cb([this.desc, key].join(' - '), t => testFunc(t, beforeVars));
      } else {
        test([this.desc, key].join(' - '), t => testFunc(t, beforeVars));
      }
    });
  }

  recursivelyFlatten(testObject, previousTitle, passedBefore = {}) {
    let before = Object.assign({}, passedBefore, this.extractBeforeObject(testObject));

    _.keys(testObject).filter(k => k !== 'before').forEach(key => {
      const fullTitle = this.constructFullTitle(previousTitle, key)

      if (typeof testObject[key] === 'function') {
        testObject[fullTitle] = [testObject[key], before];
        if (key !== fullTitle) { del(testObject, key); }
      } else if (typeof testObject[key] === 'object') {
        const flattened = this.recursivelyFlatten(del(testObject, key), fullTitle, before);
        _.keys(flattened).forEach(k => { testObject[k] = flattened[k]; });
      }
    })
    return testObject;
  }

  constructFullTitle(prev, curr) {
    return _.compact([
      prev,
      curr.indexOf(' ') === -1 ?
        _.kebabCase(curr).split('-').join(' ') :
        curr
    ]).join(' - ');
  }

  extractBeforeObject(testObj) {
    return del(testObj, 'before') || {};
  }
}

export const describe = (description, testObject) => {
  new Describer(description, testObject).runTests();
};

export const cb = (description, testObject) => {
  new Describer(description, testObject, true).runTests();
}

export default describe;
