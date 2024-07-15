global.Settings = (function() {

  // The settings are saved into the user's AppData/Roaming/Onyx directory and
  // may not be there if this this the first time they've run the application.
  const filepath = `${DATA}/settings.json`;

  let $currentSettings = {
    fontSize: 5,
    windowColor: 1,
  };

  // We load the default settings when the application starts.
  function init() {
    fs.exists(filepath, exists => {
      exists ? load() : save();
    });
  }

  function set(key, value) { $currentSettings[key] = value; }

  function setAll(options) {
    // Once we actually have some settings call set() for each setting in the
    // options parameter. Not sure if fontSize and window color are even viable
    // settings at this point. Will need some settings I'm sure.
  }

  function getAll() { return {...$currentSettings}; }

  function save() {
    FileHelper.writeJSON(filepath, $currentSettings);
  }

  function load() {
    FileHelper.readJSON(filepath).then(data => {
      $currentSettings = data;
    });
  }

  return {
    init,
    set,
    setAll,
    getAll,
    save,
  };

})();
