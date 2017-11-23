export const CONFIG = 'bricjs.config';
export const MODULES = 'bricjs.modules';
export const DEPENDENCIES = 'bricjs.dependencies';

const COMPONENT_ATTRIBUTE = 'data-bricjs-component';

let allPromises;
let config;
let modules;
let dependencies;

function process(context) {
  let promises = {};
  let resolves = {};

  let isEnabled = name => !context[name] || context[name].enabled !== false;
  let enabledModules = Object.keys(modules).filter(isEnabled);

  // Create promises for all active modules
  enabledModules.forEach(name => {
    let p = new Promise(resolve => { resolves[name] = resolve; });
    promises[name] = p;
    allPromises.push(p);
  });

  // Load modules and resolve them
  enabledModules.forEach(name => {
    let callback = modules[name];
    let opts = context[name];
    let deps = dependencies[name] || [];

    let modulePromises = deps
      .map(d => promises[d])
      .filter(p => p instanceof Promise);

    Promise.all(modulePromises).then(values => {
      let qualifiedName = config instanceof Array ? `${config.indexOf(context)}:${name}` : name;
      let parent = document.querySelector(`[${COMPONENT_ATTRIBUTE}=${qualifiedName}`);
      values.unshift(parent ? Object.assign({ parent }, opts) : opts);
      resolves[name](callback.apply(null, values));
    });
  });
}

export default function (c, m, d) {
  config = c;
  modules = m;
  dependencies = d;
  allPromises = [];

  if (config instanceof Array) {
    config.forEach(process);
  } else if (config instanceof Object) {
    process(config);
  } else {
    throw new Error(`Invalid config: ${config}`);
  }

  return Promise.all(allPromises);
}
