window.TileShelfComponent = (function() {

  let $shelfSize;
  let $shelfWidth;

  // TODO: Discard tile. We should only allow a tile to be discarded if it
  //       doesn't have the _noDiscard placement rule. I think we need to drag
  //       and drop onto a bonfire or something to discard a tile.

  // The setShelfSize() function updates the width of the tile shelf and
  // creates shelf-space elements for each position on the shelf.
  function setShelfSize(size) {
    $shelfSize = size;
    $shelfWidth = 10 + (74*size);

    const tileShelf = X.first('#tileShelf')
          tileShelf.style.width = `${$shelfWidth}px`;

    const spacesElement = X.first('#tileShelf .spaces');

    X.empty(spacesElement);
    for (let i=0; i<size; i++) {
      spacesElement.appendChild(X.createElement(`<div class='shelf-space'></div>`));
    }
  }

  // When the state is set we compare the tiles in the state with the tiles on
  // the shelf, adding or removing tile elements when nessessary. There are a
  // couple reasons I want to do it this way. In order to keep the component in
  // sync with the state on the server it's better to just set the entire state
  // at once. However I don't want to just rebuild the shelf from scratch
  // because that would make animating the tiles entering and leaving much
  // harder. This way I'm confident that the shelf state is valid, but can
  // still hook into tile animations.
  function setShelfState(shelfState) {
    const tiles = shelfState.map(tileData => Tile.unpack(tileData));
    const { added, removed } = ArrayHelper.differenceInElements(
      getCurrentTiles().map(tile => tile.getID()),
      tiles.map(tile => tile.getID()));

    removed.forEach(tileID => {
      getTileElement(tileID).remove();
    })

    tiles.forEach((tile, i) => {
      if (added.includes(tile.getID())) {
        performDrawnActions(tile);
        buildTileElement(tile);
      }
      positionTileElement(tile,i);
    });
  }

  // Right now this just enables a note if a note is set to be shown on draw.
  // I'm thinking there will be more onDrawn actions on tiles in the future
  // though.
  function performDrawnActions(tile) {
    const note = tile.getNote();
    if (note && note.getTrigger() === _drawn) {
      NoteManager.show(note.getCode());
    }
  }

  // Gets all of the tile models attached to the tile elements on the shelf.
  function getCurrentTiles() {
    return [...X('#tileShelf .tile')].map(element => element.tile);
  }

  // Build a tile component and add it to the shelf.
  function buildTileElement(tile) {
    X.first('#tileShelf .tiles').appendChild(TileComponent(tile).getElement());
  }

  // The the tiles are all absolute positioned according to their order on the
  // shelf. This function assumes a 64px wide tile, a 10px margin on the tile
  // elements, and 40px padding on either side of the shelf.
  function positionTileElement(tile, space) {
    getTileElement(tile.getID()).style.left = `${50 + (space * 74)}px`
  }

  // Get the tile element by ID.
  function getTileElement(id) {
    return X.first(`#tileShelf .tile[data-id="${id}"]`);
  }

  return {
    setShelfSize,
    setShelfState,
  }

})();