window.PlacementManager = (function() {
  
  let $placementRules;
  let $edgeStatus;
  let $placementStatus;

  function startDrag() {
    X.first('#dungeonGrid').addEventListener('click',placeTile);

    const context = DragonDrop.getDragContext();
    const tile = context.tileElement.tile;

    $placementRules = tile.getPlacementRules();
    $edgeStatus = null;

    if (isPlaceOnOrigin()) {
      highlightOrigin()
    }

    DungeonView.setMouseOverAction(checkDropTarget)
  }

  function stopDrag() {
    X.first('#dungeonGrid').removeEventListener('click',placeTile);

    removeHighlights();
    DungeonView.clearMouseOverAction();
    DragonDrop.getDragTile().setRotation(0);
  }

  // We don't want to build the $edgeStatus object every time we drag a tile
  // over the dungeon. When a tile is rotated though it's edges change so we
  // need to set it to null so that it will be rebuilt.
  function tileRotated() {
    $edgeStatus = null;
    checkDropTarget();
  }

  // === Check Drop Target =====================================================

  function checkDropTarget() {
    $placementStatus = null;

    X.removeClass('#dragElement .highlight-active', "highlight-active");

    const cellData = DungeonView.getMouseOverCell();
    const edgeStatus = getEdgeStatus();
    const nt = getNeighboringTiles(cellData.x, cellData.y);

    if (nt.n || nt.s || nt.e || nt.w) {
      const nConnect = (nt.n) ? nt.n.getEdges().s : null;
      const sConnect = (nt.s) ? nt.s.getEdges().n : null;
      const eConnect = (nt.e) ? nt.e.getEdges().w : null;
      const wConnect = (nt.w) ? nt.w.getEdges().e : null;

      $placementStatus = {
        n: isLegal(edgeStatus.n, nConnect),
        s: isLegal(edgeStatus.s, sConnect),
        e: isLegal(edgeStatus.e, eConnect),
        w: isLegal(edgeStatus.w, wConnect),
      }

      $placementStatus.canPlace = allLegal();

      decorateEdges();
    }
  }

  function getNeighboringTiles(x,y) {
    return {
      n: DungeonGridComponent.getTile(Coordinates.fromGlobal(x,y + 1)),
      s: DungeonGridComponent.getTile(Coordinates.fromGlobal(x,y - 1)),
      e: DungeonGridComponent.getTile(Coordinates.fromGlobal(x + 1,y)),
      w: DungeonGridComponent.getTile(Coordinates.fromGlobal(x - 1,y)),
    }
  }

  function isLegal(home,neighbor) {
    // When the neighboring space is empty a tile can be placed there.
    if (neighbor == null) { return 'empty'; }

    // A forbidden edge can only be placed next to an empty space. Because the
    // neighboring tile is not null, neither tile can have a forbidden edge.
    if (home === _forbidden) { return 'no'; }
    if (neighbor === _forbidden) { return 'no'; }

    // An any edge can be placed next to any other edge.
    if (home === _any) { return 'yes'; }
    if (neighbor === _any) { return 'yes'; }

    // Otherwise the edges have to match.
    return (home === neighbor) ? 'yes' : 'no'
  }

  function allLegal() {
    return $placementStatus.n !== 'no' &&
           $placementStatus.s !== 'no' &&
           $placementStatus.e !== 'no' &&
           $placementStatus.w !== 'no';
  }

  // Get the edges object {n,s,e,w} of the tile that's currently being dragged.
  function getEdgeStatus() {
    if ($edgeStatus == null) {
      $edgeStatus = DragonDrop.getDragTile().getEdges();
    }
    return $edgeStatus;
  }

  function decorateEdges() {
    const m = [
      { n:'n', s:'s', e:'e', w:'w' },
      { n:'w', s:'e', e:'n', w:'s' },
      { n:'s', s:'n', e:'w', w:'e' },
      { n:'e', s:'w', e:'s', w:'n' },
    ][DragonDrop.getDragTile().getRotation()];

    if ($placementStatus) {
      if ($placementStatus.n === 'yes') {
        X.addClass(`#dragElement .highlight-${m.n}`, `highlight-active`);
      }
      if ($placementStatus.s === 'yes') {
        X.addClass(`#dragElement .highlight-${m.s}`, `highlight-active`);
      }
      if ($placementStatus.e === 'yes') {
        X.addClass(`#dragElement .highlight-${m.e}`, `highlight-active`);
      }
      if ($placementStatus.w === 'yes') {
        X.addClass(`#dragElement .highlight-${m.w}`, `highlight-active`);
      }
    }
  }

  // === Place Tile ============================================================

  function placeTile() {
    try {
      const cellData = DungeonView.getMouseOverCell();
      const context = DragonDrop.getDragContext();
      const rotation = DragonDrop.getDragTile().getRotation();

      const placementData = {
        gx: cellData.x,
        gy: cellData.y,
        code: context.tileCode,
        id: context.tileID,
        rotation: rotation,
      };

      if (canPlaceTile(cellData)) {
        DragonDrop.stopDrag();
        ClientCommands.send('dungeon.placeTile',placementData).then(response => {
          if (response.result === _success) {
            TileShelfComponent.setShelfState(response.tileShelf.shelf);
            DungeonGridComponent.placeTile(response.tile);
            NoteManager.clear();
            executePlacementTrigger(response.tile);
          }
        });
      }
    }
    catch(error) {
      logError(`Error Placing Tile`,{ system:'PlacementManager', data:{
        error: error.message,
        placementData: placementData,
      }});
    }
  }

  function executePlacementTrigger(tile) {
    if (tile.placementTrigger) {
      localLog("Executing Placement Trigger", tile.placementTrigger);
      TriggerRegistry.lookup(tile.placementTrigger).getTriggerFunction()(tile);
    }
  }

  // TODO: Both checkDropTarget() and canPlaceTile() will need to check to
  //       see if all the edges match. We should probably only check that once
  //       in check drop target.
  function canPlaceTile(cellData) {
    if (isPlaceOnOrigin()) { return (cellData.x === 0) && (cellData.y === 0); }
    if ($placementStatus) { return $placementStatus.canPlace; }
    return false;
  }

  function isPlaceOnOrigin() {
    return ($placementRules||[]).includes(_placeOnOrigin);
  }

  function highlightOrigin() {
    X.addClass('#dungeonGrid .origin-cell','highlight');
  }

  function removeHighlights() {
    X.removeClass('#dungeonGrid .highlight','highlight');
  }

  function localLog(action, data=null) {
    log(action,{ system:'PlacementManager', data:data });
  }

  return {
    startDrag,
    stopDrag,
    tileRotated,
  };

})();