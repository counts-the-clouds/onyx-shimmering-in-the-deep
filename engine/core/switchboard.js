global.Switchboard = (function() {

  const OnyxEvents = class OnyxEvents extends events.EventEmitter {}
  const $onyxEvents = new OnyxEvents();

  let $renderCallback;
  let $renderBattleCallback;

  // This may look a bit odd because we're only allowing a single event
  // listener for all these game events. We're only passing events like this
  // because the engine and the server needed to be decoupled, so that the
  // engine can have unit tests without needing any of the electron server
  // stuff existing at all.
  function init() {
    $onyxEvents.on('browser.render', state => {
      if ($renderCallback) { $renderCallback(state); }
    });
  }

  function render(state) { $onyxEvents.emit('browser.render',state); }
  function onRender(callback) { $renderCallback = callback; }

  return {
    init,
    render,
    onRender,
  };

})();
