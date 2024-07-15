window.NoteManager = (function() {

  // TODO: This is why too complicated. I think I need to remove enable states
  //       completely. Like events there's probably only every one note possible
  //       at a time. We should delay showing notes still, but all enabled notes
  //       are removed when any kind of state change happens.

  const $enableStates = {};

  // If any notes are being shown the clear() function will hide and disable
  // them because we don't want notes being shown more than once. Clear()
  // should be called when tiles are placed but could be cleared at other times
  // as well.
  function clear() {
    const code = X.first('#noteArea').dataset.code;
    if (code) {
      disable(code);
    }
  }

  // TODO: Condition could be a boolean or a function or sometimes maybe a
  //       promise? Should it be on the note object or on the enabling
  //       function?
  function enable(code, condition=true) {
    const note = NoteRegistry.lookup(code);

    $enableStates[code] = condition;

    window.setTimeout(() => {
      if ($enableStates[code]) { showNote(code) }
    }, note.getDelay());
  }

  // Prevent the note from being shown and remove the note if it already has
  // been.
  function disable(code) {
    delete $enableStates[code];

    const noteArea = X.first('#noteArea');
    if (noteArea.dataset.code === code) {
      noteArea.dataset.code = null;
      X.removeClass(noteArea,'show');
      X.addClass(noteArea,'hide');
    }
  }

  // Show a note in the bottom corner of the screen. These are shown after
  // some delay and then slowly faded in. They're meant to show helpful
  // suggestions. Could use them for something else eventually too. Tips from
  // advisors, that sort of thing.
  //
  // TODO: If a note is already being shown I think we just overwrite the
  //       previous note. Need to make sure this looks good. Might need to
  //       adjust what happens on show below.
  function showNote(code) {
    const note = NoteRegistry.lookup(code);
    const noteArea = X.first('#noteArea');

    X.empty(noteArea);
    noteArea.innerHTML = `<p>${note.getText()}</p>`
    noteArea.dataset.code = code;

    X.removeClass(noteArea,'hide');
    window.setTimeout(() => {
      X.addClass(noteArea,'show');
    },100);
  }

  return {
    clear,
    enable,
    disable,
  };

})();
