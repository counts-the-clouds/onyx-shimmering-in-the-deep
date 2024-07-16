window.TileBagComponent = (function() {

  // The game state has been changed. This may put the tile bag into a
  // completely different state. The tile bag should be shown by default, so
  // it's fine if tile-bag.show is undefined.
  function refresh() {
    ClientCommands.send('game.getFlag','tile-bag.show').then(flag => {
      (flag === false) ? hide() : show();
    });
  }

  function show() { X.removeClass('#tileBag','hide'); }
  function hide() { X.addClass('#tileBag','hide'); }

  // TODO: Starting and ending a sequence of tiles changes how tiles are drawn.
  //       This will probably need to be reflected on the shelf as well.
  function startSequence() { }
  function endSequence() { }

  // This will ask the server for a tile, then probably kick off an animation
  // to show it being placed on the shelf.
  function drawTile() {
    ClientCommands.send('tileBag.drawTile').then(response => {
      TileShelfComponent.setShelfState(response.tileShelf.shelf);
    });
  }

  return {
    refresh,
    show,
    hide,
    drawTile
  }

})();
