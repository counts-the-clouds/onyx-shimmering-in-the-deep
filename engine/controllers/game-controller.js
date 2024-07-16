global.GameController = (function() {

  function init() {
    ipcMain.handle("game.getFlag", getFlag);
    ipcMain.handle("game.new", newGame);

  }

  function getFlag(event, flag) {
    return GameState.getFlag(flag);
  }

  function newGame() {
    localLog("new");
    GameBuilder.newGame();
  }

  function localLog(action, data=null) {
    log(action,{ system:'GameController', data:data });
  }


  return { init };

})();
