window.MouseMovement = (function() {

  let $dragContext;

  function init() {
    window.addEventListener('mousedown', event => {
      if (DungeonView.isMovementEnabled() && event.target.closest('#dungeonGrid')) {
        startDrag();
      }
    });
  }

  function startDrag() {
    let position = MainContent.getMousePosition();
    let offset = DungeonGridComponent.getPositionOffset();

    $dragContext = {
      originX: position.x,
      originY: position.y,
      offsetX: offset.x,
      offsetY: offset.y,
    }

    window.addEventListener('mousemove', performDrag);
    window.addEventListener('mouseup', stopDrag);
  }

  function performDrag() {
    let position = MainContent.getMousePosition();

    // No idea how this math works, but it all seems to work.
    let x = (position.x + $dragContext.offsetX - $dragContext.originX)
    let y = (position.y - $dragContext.offsetY - $dragContext.originY) * -1;

    DungeonGridComponent.setPositionOffset(x,y);
  }

  function stopDrag() {
    window.removeEventListener('mousemove', performDrag);
    window.removeEventListener('mouseup', stopDrag);
  }

  return {
    init
  };

})();