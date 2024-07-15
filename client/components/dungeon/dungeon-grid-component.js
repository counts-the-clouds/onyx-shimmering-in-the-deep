window.DungeonGridComponent = (function() {

  // Not sure if this is going to work at all at the moment. Right now I'm
  // going to try and implement the dungeon grid using normal HTML elements. I
  // think this should be efficient enough. It's essentially an infinite scroll
  // structure, but in two directions. We will probably need to remove and
  // rebuild chunks as they scroll out of view.

  let $dungeonChunks;
  let $chunkRange = { maxX:0, minX:0, maxY:0, minY:0 };

  let $positionOffset = { x:0, y:0 };
  let $positionLimits = { top:0, bottom:0, left:0, right:0 };

  function setState(state) {
    $dungeonChunks = {};

    Object.keys(state.chunks).forEach(chunkID => {
      setChunk(chunkID, state.chunks[chunkID]);
    });

    calculatePositionLimits();
    recenterDungeonGrid();
  }

  // TODO: Not sure yet if we're ever going to be setting a whole chunk at a
  //       time or if tiles will always be updated on an individual basis. I
  //       know we'll be adding chunks as we place tiles outside of the initial
  //       chunks. When that happens we'll need to add a chunk element and
  //       recalculate the bounds, but that sounds more like an addChunk()
  //       method and not setChunk()

  function setChunk(chunkID, chunkData) {
    if ($dungeonChunks[chunkID] != null) {
      // this chunk already exists. We need to update the data, not add a new chunk.
      return null;
    }

    if (chunkData.cx > $chunkRange.maxX) { $chunkRange.maxX = chunkData.cx }
    if (chunkData.cx < $chunkRange.minX) { $chunkRange.minX = chunkData.cx }
    if (chunkData.cy > $chunkRange.maxY) { $chunkRange.maxY = chunkData.cy }
    if (chunkData.cy < $chunkRange.minY) { $chunkRange.minY = chunkData.cy }

    let chunk = new DungeonChunkComponent(chunkData.cx, chunkData.cy);
        chunk.buildElement();
        chunk.setCellData(chunkData.cells);

    $dungeonChunks[chunkID] = chunk;
  }

  // TODO: We'll need to build the chunk if it doesn't exist. I think this
  //       will only happen when the first tile is placed in that chunk so
  //       it should be empty. If we do some kind of infinite scroll where
  //       we're loading and unloading chunks that might not be the case,
  //       except the chunk you place a tile in should always be visible if
  //       that were the case.

  function placeTile(tileData) {
    let tile = Tile.unpack(tileData);
    let tileComponent = new TileComponent(tile)

    let chunk = $dungeonChunks[tile.getCoordinates().chunkID];
        chunk.setTile(tileComponent);
  }

  // If the chunk exists, and the cell has a tile set in it, it's first child
  // should be the element that the tileComponent creates and should have the
  // tile expando property.
  function getTile(coords) {
    const chunk = $dungeonChunks[coords.chunkID]
    const cell = chunk ? chunk.getCell(coords) : null;
    return (cell && cell.children[0]) ? cell.children[0].tile : null;
  }

  // === Dungeon Grid Movement =================================================

  function calculatePositionLimits() {
    $positionLimits.top =    ($chunkRange.maxY+1) * _chunkSize * -1;
    $positionLimits.bottom = ($chunkRange.minY)   * _chunkSize * -1;
    $positionLimits.left =   ($chunkRange.maxX+1) * _chunkSize * -1;
    $positionLimits.right =  ($chunkRange.minX)   * _chunkSize * -1;
  }

  function getPositionOffset() { return {...$positionOffset}; }

  // Adjust the point that the dungeon grid is centered around.
  function setPositionOffset(x,y) {
    $positionOffset.x = x
    $positionOffset.y = y

    if ($positionOffset.x < $positionLimits.left)   { $positionOffset.x = $positionLimits.left;   }
    if ($positionOffset.x > $positionLimits.right)  { $positionOffset.x = $positionLimits.right;  }
    if ($positionOffset.y < $positionLimits.top)    { $positionOffset.y = $positionLimits.top;    }
    if ($positionOffset.y > $positionLimits.bottom) { $positionOffset.y = $positionLimits.bottom; }

    recenterDungeonGrid();
  }

  // Center the dungeon grid around the position offset.
  function recenterDungeonGrid() {
    let left = (window.innerWidth/2) - 32 + $positionOffset.x;
    let bottom = (window.innerHeight/2) - 32 + $positionOffset.y;

    X.first('#dungeonGrid').setAttribute('style',`left:${left}px; bottom:${bottom}px`);
  }

  return {
    setState,
    placeTile,
    getTile,
    getPositionOffset,
    setPositionOffset,
    recenterDungeonGrid,
  }

})()