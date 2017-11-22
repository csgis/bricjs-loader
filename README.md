[![Build Status](https://travis-ci.org/csgis/bricjs-loader.svg?branch=master)](https://travis-ci.org/csgis/bricjs-loader) [![codecov](https://codecov.io/gh/csgis/bricjs-loader/branch/master/graph/badge.svg)](https://codecov.io/gh/csgis/bricjs-loader) [![npm](https://img.shields.io/npm/v/@csgis/bricjs-loader.svg)](https://www.npmjs.com/package/@csgis/bricjs-loader) [![downloads](https://img.shields.io/npm/dt/@csgis/bricjs-loader.svg)](https://www.npmjs.com/package/@csgis/bricjs-loader)

# BricJS loader

BricJS lets you integrate reusable modules in an application easily.

You might want to use it in combination of the [json-modules-loader](https://github.com/csgis/json-modules-loader) and [json-module-args-loader](https://github.com/csgis/json-module-args-loader). See an [example](https://github.com/csgis/bricjs-sample-app).

## Install

With npm:

```
npm add --save-dev @csgis/bricjs-loader
```

With yarn:

```
yarn add -D @csgis/bricjs-loader
```

# Usage

**greeting.js**:
```js
export default function (props, timeService, renderer) {
  if (timeService.isAfternoon()) {
    renderer.render('Good afternoon, ' + props.name);
  } else {
    renderer.render('Hello, ' + props.name);
  }
}
```

**main.js**:
```js
import load from '@csgis/bricjs-loader';
import greeting from './greeting';
import time from 'someTimeRenderer';
import render from 'someRenderer';

let config = {
  "greeting": {
    "name": "Víctor"
  }
};

let modules = { greeting, time, render };
let deps = {
  greeting: [time, render]
}

load(config, modules, deps);
```

## API

It exports a single default function expecting the following parameters:

* `config` (*Object* or *Array* of *Object*). Each object is considered a **context**. For each *context*, keys are module names (used by the other arguments); values are the `props` values to be passed to the modules when called (first argument).
* `modules` (*Object*): Keys are module names (used by the other arguments); values are functions to be called.

  Those functions must accept the following arguments:

  * `props`: An object with data for customizing the module.
  * `...deps`: One or more dependencies, as separated arguments.

  For example:

  ```js
  export function bricjs(props, timeService, renderer) {
    if (timeService.isAfternoon()) {
      renderer.render('Good afternoon, ' + props.name);
    } else {
      renderer.render('Hello, ' + props.name);
    }
  }
  ```

* `deps` (*Object*): Keys are modules names (used by the other arguments); values are arrays of module names to be passed as dependencies for the functions in `modules`.

**IMPORTANT**: Each module can be disabled (its `bricjs` function will never be called) via configuration by adding the `enabled` property with a `false` value. For example:

```json
{
  "greeting": {
    "name": "Víctor",
    "enabled": false
  }
}
```
