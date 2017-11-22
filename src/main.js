export default function (config, modules, moduleDeps) {
  let allPromises = [];

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
      let deps = moduleDeps[name] || [];

      let modulePromises = deps
        .map(d => promises[d])
        .filter(p => p instanceof Promise);

      Promise.all(modulePromises).then(values => {
        values.unshift(opts);
        resolves[name](callback.apply(null, values));
      });
    });
  }

  if (config instanceof Array) {
    config.forEach(process);
  } else if (config instanceof Object) {
    process(config);
  } else {
    throw new Error(`Invalid config: ${config}`);
  }

  return Promise.all(allPromises);
}
