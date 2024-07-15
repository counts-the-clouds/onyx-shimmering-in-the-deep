window.KeyboardMovement = (function() {

  const _slowSpeed = 50;
  const _fastSpeed = 150;
  const _movementTimerSpeed = 100;

  let $movementState = { speed:_slowSpeed, n:false, s:false, e:false, w:false };

  function init() {
    window.addEventListener('keydown', event => {
      if (DungeonView.isVisible() && DungeonView.isMovementEnabled()) {
        onMoveDown(getMovementBinding(event.code));
      }
    });

    window.addEventListener('keyup', event => {
      onMoveUp(getMovementBinding(event.code), isShift(event));
    });

    window.addEventListener('keydown', event => {
      if (isShift(event)) { $movementState.speed = _fastSpeed; }
    });

    window.addEventListener('keyup', event => {
      if (isShift(event)) { $movementState.speed = _slowSpeed; }
    });
  }

  function getMovementBinding(code) {
    return ArrayHelper.compact(WorldState.options.keyBindings.map(binding => {
      if (binding.action.match(/action.move/)) {
        if (binding.codes.includes(code)) { return binding; }
      }
    }))[0];
  }

  function isShift(event) {
    return event.code === _keyCodeShiftLeft
  }

  function onMoveDown(binding) {
    if (binding) {
      if (binding.action == 'action.move-up')    { startMoveS(); }
      if (binding.action == 'action.move-down')  { startMoveN(); }
      if (binding.action == 'action.move-left')  { startMoveE(); }
      if (binding.action == 'action.move-right') { startMoveW(); }
    }
  }

  function onMoveUp(binding) {
    if (binding) {
      if (binding.action == 'action.move-up')    { stopMoveVert(); }
      if (binding.action == 'action.move-down')  { stopMoveVert(); }
      if (binding.action == 'action.move-left')  { stopMoveHorz(); }
      if (binding.action == 'action.move-right') { stopMoveHorz(); }
    }
  }

  function startMoveN() { $movementState.n = true; $movementState.s = false; panDungeonGrid(); }
  function startMoveS() { $movementState.s = true; $movementState.n = false; panDungeonGrid(); }
  function startMoveE() { $movementState.e = true; $movementState.w = false; panDungeonGrid(); }
  function startMoveW() { $movementState.w = true; $movementState.e = false; panDungeonGrid(); }
  function stopMoveVert() { $movementState.n = false; $movementState.s = false; panDungeonGrid(); }
  function stopMoveHorz() { $movementState.e = false; $movementState.w = false; panDungeonGrid(); }

  // The panDungeonGrid() function only starts or stops the movement timer. If
  // the keys are adjusted (i.e. up pressed when panning left) that new movement
  // state is read by the executeMove() function.
  function panDungeonGrid() {
    if ($movementState.interval == null) {
      if ($movementState.n || $movementState.s || $movementState.e || $movementState.w) {
        $movementState.interval = window.setInterval(executeMove,_movementTimerSpeed);
        enableTransition();
        return executeMove();
      }
    }

    if ($movementState.interval) {
      if (!$movementState.n && !$movementState.s && !$movementState.e && !$movementState.w) {
        window.clearInterval($movementState.interval);
        disableTransition()
        $movementState.interval = null;
      }
    }
  }

  function executeMove() {
    let position = DungeonGridComponent.getPositionOffset();

    if ($movementState.n) { position.y -= $movementState.speed; }
    if ($movementState.s) { position.y += $movementState.speed; }
    if ($movementState.e) { position.x -= $movementState.speed; }
    if ($movementState.w) { position.x += $movementState.speed; }

    DungeonGridComponent.setPositionOffset(position.x,position.y);
  }

  // The transition is needed to make the dungeon grid movement look smooth.
  // We only want it transitioning while the keyboard movement is being done
  // though because it makes the resize behavior look weird.
  function enableTransition() {
    X.addClass('#dungeonGrid','shouldPan');
  }

  // We need to wait for the transition to finish before turning it off, but
  // we only want to turn it off if we're not still panning.
  function disableTransition() {
    window.setTimeout(() => {
      if ($movementState.interval == null) {
        X.removeClass('#dungeonGrid','shouldPan');
      }
    },500);
  }

  return {
    init
  }

})();