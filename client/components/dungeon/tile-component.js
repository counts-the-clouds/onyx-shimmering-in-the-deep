window.TileComponent = function(tile) {

  const $tile = tile;
  const $element = X.createElement(`<div class="tile" data-code="${tile.getCode()}" data-id="${tile.getID()}">`);

  $element.tileComponent = this;
  $element.tile = tile;
  $element.style.transform = `rotate(${tile.getRotation()*90}deg)`;

  tile.getClientLayers().forEach(layer => {
    let layerElement = X.createElement(`<div class='layer'>`);
    layerElement.style['background-image'] = X.assetURL(layer.background);
    $element.append(layerElement);
  });

  function getTile() { return $tile; }
  function getElement() { return $element; }

  return Object.freeze({
    getTile,
    getElement,
  });
};
