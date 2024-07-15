global.GameController = (function() {

  function init() {
    ipcMain.handle("game.new", newGame);
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
