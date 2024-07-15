global.fs = require('fs');
global.events = require('events');

require(`${ROOT}/engine/loader`);

// These are all the files where load order matter and should be loaded
// before anything else.
const Preload = [
  'core/constants.js',
];

const CoreModules = [
  'core',
  'helpers',
];

const GameModules = [
  'builders',
  'members',
  'models',
];

const DataModules = [
  'events',
  'notes',
  'tiles',
  'triggers',
];

console.log('=== Booting Main Process ===')

try {
  Preload.forEach(script =>        { Loader.loadFile(`${ROOT}/engine/${script}`);         });
  CoreModules.forEach(directory => { Loader.loadDirectory(`${ROOT}/engine/${directory}`); });
  GameModules.forEach(directory => { Loader.loadDirectory(`${ROOT}/engine/${directory}`); });
  DataModules.forEach(directory => { Loader.loadDirectory(`${ROOT}/data/${directory}`);   });

  if (Environment.isNotTest()) {
    Loader.loadDirectory(`${ROOT}/engine/controllers`);
    Loader.loadDirectory(`${ROOT}/engine/server`);
  }

  Initializer.init();
} catch(e) {
  console.error("\n!!! Error Booting Main Process !!!\n");
  console.error(e);
  process.exit(1)
}
