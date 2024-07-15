global.NoteRegistry = (function() {

  const $noteRegistry = {}

  function register(code, note) {
    if ($noteRegistry[code]) {
      throw `The note [${code}] already exists.`
    }
    $noteRegistry[code] = note;
  }

  function lookup(code) {
    if ($noteRegistry[code] == null) {
      throw `Unknown Note [${code}]`
    }
    return $noteRegistry[code];
  }

  function getSize() { return Object.keys($noteRegistry).length }

  return {
    register,
    lookup,
    getSize,
  }

})();