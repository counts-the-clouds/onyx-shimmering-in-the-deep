global.TileBagController = (function() {

  function init() {
    ipcMain.handle("tileBag.drawTile", drawTile);
  }

  function drawTile() {
    localLog("draw-tile");

    // TODO: If we try and draw a tile, and there are no tiles in the bag
    //       this should trigger a game over event, for now we can just throw
    //       an exception reminding us to do this.
    if (TileBag.size() == 0) {
      throw `There are no more tiles left in the bag. Game over.`
    }

    TileBag.pushTile();

    return { result:_success, tileShelf:TileShelf.pack() };
  }

  function localLog(action, data=null) {
    log(action,{ system:'TileBagController', data:data });
  }

  return { init };

})();
