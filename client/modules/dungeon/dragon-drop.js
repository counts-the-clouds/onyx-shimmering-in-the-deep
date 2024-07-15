window.DragonDrop = (function() {

  let $dragContext;

  function init() {
    X.onClick('#tileShelf .tile', startDrag);
    X.registerKeyAction("action.rotate-clockwise", isDragging, rotateClockwise);
    X.registerKeyAction("action.rotate-widdershins", isDragging, rotateWiddershins);
  }

  function isDragging() { return $dragContext != null; }
  function getDragContext() { return {...$dragContext}; }
  function getDragTile() { return getDragContext().tileElement.tile; }

  function startDrag(event) {
    if ($dragContext) { return false; }

    let tile = event.target.closest('.tile');

    // TODO: PlacementManager needs to check if there are any tiles with
    //       _placeNext on the shelf, and only allow that tile to be picked up
    //       if there are.

    $dragContext = {
      tileCode: tile.dataset.code,
      tileID: +tile.dataset.id,
      tileElement: tile,
      dragElement: X.first('#dragElement'),
    }

    X.addClass('#dungeonView','drag-active');
    X.addClass(tile,'picked-up');
    X.removeClass($dragContext.dragElement,'hide');

    copyTileLayers()

    window.addEventListener('mousemove', performDrag);
    window.addEventListener('contextmenu', stopDrag);

    PlacementManager.startDrag();

    performDrag();
  }

  function stopDrag() {
    X.removeClass('#dungeonView','drag-active');
    X.removeClass($dragContext.tileElement,'picked-up');
    X.addClass($dragContext.dragElement,'hide');
    X.removeAttribute($dragContext.dragElement,'style');

    window.removeEventListener('mousemove', performDrag);
    window.removeEventListener('contextmenu', stopDrag);

    PlacementManager.stopDrag()

    $dragContext = null;
  }

  function performDrag() {
    const mousePosition = MainContent.getMousePosition();
    $dragContext.dragElement.style['top'] = `${mousePosition.y - 32}px`;
    $dragContext.dragElement.style['left'] = `${mousePosition.x - 32}px`;
  }

  function copyTileLayers() {
    X.empty($dragContext.dragElement);
    for (let layer of $dragContext.tileElement.children) {
      $dragContext.dragElement.append(layer.cloneNode(true));
    }

    // Add the placement highlight layers on top of whatever layers already exist.
    ['n','s','e','w'].forEach(x => {
      $dragContext.dragElement.append(X.createElement(`<div class="layer highlight-${x}">`));
    });
  }

  // === Tile Rotation =========================================================

  function rotateClockwise() {
    const tile = getDragTile()
    const element = $dragContext.dragElement;

    if (isRotateAllowed(tile) == false) {
      return noRotate(1);
    }

    tile.rotateClockwise();

    let rotation = lookupRotation(element);
        rotation += 90;

    element.style.transform = `rotate(${rotation}deg)`
    PlacementManager.tileRotated();
  }

  function rotateWiddershins() {
    const tile = getDragTile()
    const element = $dragContext.dragElement;

    if (isRotateAllowed(tile) == false) {
      return noRotate(-1);
    }

    tile.rotateWiddershins();

    let rotation = lookupRotation(element);
        rotation -= 90;

    element.style.transform = `rotate(${rotation}deg)`
    PlacementManager.tileRotated();
  }

  function isRotateAllowed(tile) {
    return ! (tile.getPlacementRules()||[]).includes(_noRotate);
  }

  // If a tile can't rotate we still want to play a little animation showing
  // the tile start to rotate, than quickly turning back.
  function noRotate(direction) {
    const element = $dragContext.dragElement;

    element.style['transform'] = `rotate(${direction * 20}deg)`;
    element.style['transition-duration'] = `100ms`;

    setTimeout(() => {
      element.style['transform'] = `rotate(0deg)`
    },100)

    setTimeout(() => {
      element.style['transform'] = ``
      element.style['transition-duration'] = ``;
    },200)
  }

  // I don't care what people say, regex is awesome.
  function lookupRotation(element) {
    const transform = element.style.transform;
    return (transform == '') ? 0 : parseInt(transform.match(/(-?\d+)/)[0]);
  }

  return {
    init,
    getDragContext,
    getDragTile,
    stopDrag,
  }

})();