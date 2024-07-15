global.GameBuilder = (function() {

  // When starting a new game we need to determine what expansion packs have
  // been unlocked. The first time this is run nothing will have been unlocked
  // yet, so there's nothing really to even show. I think we skip the new game
  // configuration step entirely then, and render a new baseline game.
  function newGame() {
    beginGame();
  }

  // The beginGame() function will need to create the game state given the
  // selected expansion packs and considering whatever other content has been
  // unlocked. This will tie heavily into the roguelike progression I have
  // planned, but doesn't exist yet. For now we can just always start a
  // baseline game, assuming it's never been played before.
  function beginGame() {
    GameState.clear();
    beginBaselineGame();

    // Once whichever game has been built we need to save the current game
    // state as well as the world state (in case starting a new game modifies
    // it in some way)
    GameState.saveState();
    WorldState.saveState();

    // TODO: This obviously needs to go somewhere else.
    Switchboard.render({
      showView: 'DungeonView',
      flags: GameState.getFlags(),
      tileShelf: TileShelf.pack(),
      dungeonGrid: DungeonGrid.pack(),
    });
  }

  // TODO: I think a lot of the GameBuilder stuff should be moved into data
  //       objects if we start to have a lot of different game types.

  function beginBaselineGame() {
    GameState.setFlag('baseline-game',true);

    let startingTile = Tile('forest-1',{
      placementEvent: 'game-start-1',
      placementRules: [_placeOnOrigin, _noRotate],
    });
    startingTile.buildSegments();

    TileShelf.addTile(startingTile);
  }

  return {
    newGame,
  };

})();