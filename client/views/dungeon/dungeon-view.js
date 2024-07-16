window.DungeonView = (function() {

  let $isVisible;
  let $movementEnabled;

  let $mouseOverCell;
  let $mouseOverAction;

  function init() {
    X.onResize(isVisible, () => {
      DungeonGridComponent.recenterDungeonGrid();
    });
  }

  function show(state) {
    $isVisible = true;
    $movementEnabled = false;

    log("Show",{ system:"DungeonView" });

    MainContent.show({ path:"client/views/dungeon/dungeon-view.html" }).then(() => {
      DungeonGridComponent.setState(state.dungeonGrid);
      TileShelfComponent.setShelfSize(state.tileShelf.size);
      TileShelfComponent.setShelfState(state.tileShelf.shelf);
      TileBagComponent.refresh();

      MainContent.hideCover({ fadeTime:500 });
    });
  }

  function isVisible() { return $isVisible; }
  function isMovementEnabled() { return $movementEnabled; }
  function setMovementEnabled(enable) { $movementEnabled = enable; }

  // === Mouse Over Actions ====================================================
  // A single mouse listener on the window won't work for mouse over actions on
  // tiles because if we're dragging a tile, that tile will absorb all of the
  // mouse actions. Instead we add a mouse listener to each cell and keep track
  // of the current cell we're over. If a mouse over action has been set, that
  // action is executed when a new cell is hovered over. I don't think we need
  // to implement the mouse out event, but we can trigger something if the
  // current cell changes if necessary.

  function getMouseOverCell() {
    return { ...$mouseOverCell };
  }

  function setMouseOverCell(x, y, cell, event) {
    if ($mouseOverCell == null || $mouseOverCell.x !== x || $mouseOverCell.y !== y) {
      $mouseOverCell = { x, y, cell };

      if ($mouseOverAction) {
        $mouseOverAction(event);
      }
    }
  }

  function clearMouseOverAction() { $mouseOverAction = null; }
  function setMouseOverAction(action) { $mouseOverAction = action; }

  return {
    init,
    show,
    isVisible,
    isMovementEnabled,
    setMovementEnabled,

    getMouseOverCell,
    setMouseOverCell,
    clearMouseOverAction,
    setMouseOverAction,
  }

})();