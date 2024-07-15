global.TriggerRegistry = (function() {

  const $triggerRegistry = {};

  function register(code, data) {
    if ($triggerRegistry[code]) {
      throw `The trigger [${code}] already exists.`
    }
    $triggerRegistry[code] = data;
  }

  function lookup(code) {
    if ($triggerRegistry[code] == null) {
      throw `Unknown Trigger [${code}]`
    }
    return $triggerRegistry[code];
  }

  function getSize() { return Object.keys($triggerRegistry).length }

  return {
    register,
    lookup,
    getSize,
  }

})();
