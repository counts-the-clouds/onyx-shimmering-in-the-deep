describe("DungeonGrid", function() {

  afterEach(function() {
    DungeonGrid.clear();
  });

  describe("getCell()", function() {
    it("when chunk is empty", function() {
      let cell = DungeonGrid.getCell(Coordinates.fromGlobal(150,75));
      expect(cell).to.equal(null)
    });

    it("when cell is empty", function() {
      let cell = DungeonGrid.getCell(Coordinates.fromGlobal(5,15));
      expect(cell).to.equal(null)
    });

    it("when cell has a value", function() {
      let coords = Coordinates.fromGlobal(5,15);
      DungeonGrid.setCell(coords, Tile('forest-1'));

      let tile = DungeonGrid.getCell(coords);
      expect(tile.getCode()).to.equal('forest-1');
    });
  });

  describe("setCell()", function() {
    it('creates a new chunk if needed', function() {
      let coords = Coordinates.fromGlobal(150,75);
      DungeonGrid.setCell(coords, Tile('forest-1'));
      expect(DungeonGrid.pack().chunks['[9|4]'].cells[coords.ci].code).to.equal('forest-1');
    });
  });

});