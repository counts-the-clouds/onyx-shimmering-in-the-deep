global.Note = function(code, options) {

  const $code = code;
  const $text = options.text;
  const $delay = options.delay || 3000;

  let $trigger;

  if (typeof $text !== 'string') {
    throw `Note text is required.`
  }

  function getCode() { return $code }
  function getText() { return $text }
  function getDelay() { return $delay }

  function getTrigger() { return $trigger }
  function setTrigger(when) { $trigger = when; }

  return Object.freeze({
    getCode,
    getText,
    getDelay,
    getTrigger,
    setTrigger,
  });
}

Note.build = function(code, options) {
  NoteRegistry.register(code, Note(code,options));
}
