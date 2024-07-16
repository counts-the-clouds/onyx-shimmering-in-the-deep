global.DungeonController = (function() {

  function init() {
    ipcMain.handle("dungeon.placeTile", placeTile);
  }

  function placeTile(event,data) {
    localLog("placeTile",data);

    const coords = Coordinates.fromGlobal(data.gx, data.gy);
    const tile = TileShelf.getTile(data.id);
          tile.setRotation(data.rotation);

    TileShelf.removeTile(data.id);
    DungeonGrid.setCell(coords, tile);

    if (tile.getPlacementEvent()) {
      EventManager.triggerEvent(tile.getPlacementEvent());
    }

    if (TileBag.isSequence()) {
      TileBag.pushTile();
    }

    return {
      result: _success,
      tile: DungeonGrid.getCell(coords).pack(),
      tileShelf: TileShelf.pack(),
    };
  }

  function localLog(action, data=null) {
    log(action,{ system:'DungeonController', data:data });
  }

  function renderDungeon() {
    Switchboard.render({
      showView: 'DungeonView',
      flags: GameState.getFlags(),
      tileShelf: TileShelf.pack(),
      dungeonGrid: DungeonGrid.pack(),
    });
  }

  return {
    init,
    renderDungeon
  };

})();
