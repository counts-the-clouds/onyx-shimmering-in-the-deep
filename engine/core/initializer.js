global.Initializer = (function() {

  function init() {
    Switchboard.init();
    Logger.init();

    log(`Initializing in ${Environment.getName()} mode`);

    if (Environment.isNotTest()) {
      Browser.init();
      Controllers.initAll();
    }

    // What to do about settings? Should be made into a promise.
    // Settings.init();

    return Promise.all([
      WorldState.loadState(),
      GameState.loadState(),
    ]);
  }

  return { init }

})();

