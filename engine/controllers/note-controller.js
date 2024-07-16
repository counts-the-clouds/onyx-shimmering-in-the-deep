global.NoteController = (function() {

  function show(code) {
    Browser.send('render', { type:'note', code:code });
  }

  return { show }

})();
