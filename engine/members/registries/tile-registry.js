global.TileRegistry = (function() {

  const $tileRegistry = {};

  function register(code, data) {
    if ($tileRegistry[code]) {
      throw `The tile [${code}] already exists.`
    }
    $tileRegistry[code] = data;
  }

  function lookup(code) {
    if ($tileRegistry[code] == null) {
      throw `Unknown Tile [${code}]`
    }
    return $tileRegistry[code];
  }

  function getSize() { return Object.keys($tileRegistry).length }

  return {
    register,
    lookup,
    getSize,
  }

})();