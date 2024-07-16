window.NoteManager = (function() {

  let $heldNote;

  function clear() {
    $heldNote = null;

    const noteArea = X.first('#noteArea');
    X.removeClass(noteArea,'show');
    X.addClass(noteArea,'hide');
  }

  function show(code) {
    $heldNote = NoteRegistry.lookup(code);
    window.setTimeout(showHeldNote, $heldNote.getDelay());
  }

  function showHeldNote() {
    if ($heldNote) {
      const noteArea = X.first('#noteArea');
      X.empty(noteArea);
      noteArea.innerHTML = `<p>${$heldNote.getText()}</p>`

      // This timeout is nessessary to trigger the opacity transition.
      X.removeClass(noteArea,'hide');
      window.setTimeout(() => { X.addClass(noteArea,'show'); },10);
    }
  }

  return {
    clear,
    show,
  };

})();
