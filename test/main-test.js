debugger; // eslint-disable-line no-debugger

import load from '../src/main.js';
import assert from 'assert';

let map = (opts) => opts;
let layers = (opts, mymap) => { mymap.ten = 10; };
let deps = { layers: ['map'] };

describe('module', function () {
  it('loads modules', function (done) {
    let config = {
      map: { boo: 2 }
    };

    load([config], { map, layers }, deps)
      .then(() => assert.equal(10, config.map.ten))
      .then(done, done);
  });

  it('disables modules', function (done) {
    let config = {
      map: { boo: 2 },
      layers: { enabled: false }
    };

    load([config], { map, layers }, deps)
      .then(() => assert(!config.map.ten))
      .then(done, done);
  });

  it('uses config as object', function (done) {
    let config = {
      map: { boo: 2 }
    };

    load(config, { map, layers }, deps)
      .then(() => assert.equal(10, config.map.ten))
      .then(done, done);
  });

  it('throws error on invalid config', function () {
    try {
      load('invalid_config', { map, layers }, deps);
      assert.fail();
    } catch (e) {
      // ignore
    }
  });
});
