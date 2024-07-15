global.EventRegistry = (function() {

  const $eventRegistry = {};

  function register(code, data) {
    if ($eventRegistry[code]) {
      throw `The event [${code}] already exists.`
    }
    $eventRegistry[code] = data;
  }

  function lookup(code) {
    if ($eventRegistry[code] == null) {
      throw `Unknown Event [${code}]`
    }
    return $eventRegistry[code];
  }

  function getSize() { return Object.keys($eventRegistry).length }

  return {
    register,
    lookup,
    getSize,
  }

})();