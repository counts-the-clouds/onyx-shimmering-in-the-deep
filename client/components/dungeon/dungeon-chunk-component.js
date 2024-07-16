window.DungeonChunkComponent = function(x,y) {

  const $cx = x;
  const $cy = y;
  let $element;

  function buildElement() {
    $element = X.createElement(`<div class='dungeon-chunk'></div>`);
    $element.setAttribute('style',` left:${$cx * _chunkSize}px; bottom:${$cy * _chunkSize}px;`)

    X.first('#dungeonGrid').appendChild($element);
  }

  function setCellData(cellData) {
    for (let i=0; i<256; i++) {
      $element.appendChild(this.buildCell(i,cellData[i]));
    }
  }

  // Build a cell element. Even if the cell is empty I want to include a
  // position label for debugging purpose.
  function buildCell(i,cell) {

    // Grid layouts go from the upper left corner in reading order, but we
    // place the cells from the lower left and go up. Also grid layouts are 1
    // indexed and the cell array is 0 indexed.
    let row = _dungeonChunkSize - Math.floor(i / _dungeonChunkSize) + 1;
    let col = (i % _dungeonChunkSize) + 1;
    let coords = Coordinates.fromChunk($cx, $cy, i);

    let cellElement = X.createElement(`
      <div class='dungeon-cell index-${i}'>
      </div>`);

    this.checkOrigin(i,cellElement);

    cellElement.setAttribute('style',`grid-row:${row}; grid-column:${col};`)
    cellElement.dataset.gx = coords.gx;
    cellElement.dataset.gy = coords.gy;
    cellElement.dataset.cx = $cx;
    cellElement.dataset.cy = $cy;
    cellElement.dataset.ci = i;

    cellElement.addEventListener('mouseover', event => {
      DungeonView.setMouseOverCell(coords.gx, coords.gy, cellElement, event);
    });

    if (cell === 0) {
      X.addClass(cellElement,'empty');
      cellElement.appendChild(X.createElement(`<div class='position-label'>(${coords.gx},${coords.gy})</div>`))
    }

    if (cell !== 0) {
      cellElement.appendChild(TileComponent(Tile.unpack(cell)).getElement());
    }

    return cellElement;
  }



  function getCell(coords) {
    return $element.querySelectorAll(`.index-${coords.ci}`)[0];
  }

  function checkOrigin(i,element) {
    if ($cx === 0 && $cy === 0 && i === 0) {
      X.addClass(element,'origin-cell');
    }
  }

  function setTile(tileComponent) {
    let coords = tileComponent.getTile().getCoordinates();
    let cell = this.getCell(coords);

    X.empty(cell);
    X.removeClass(cell,'empty');
    cell.appendChild(tileComponent.getElement());
  }

  return Object.freeze({
    buildElement,
    setCellData,
    buildCell,
    getCell,
    checkOrigin,
    setTile,
  });
}
