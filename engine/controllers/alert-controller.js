global.AlertController = (function() {

  function sendInfo(options) { sendAlert(options, 'info'); }
  function sendSuccess(options) { sendAlert(options, 'success'); }
  function sendWarning(options) { sendAlert(options, 'warning'); }
  function sendError(options) { sendAlert(options, 'danger'); }

  // Alert Options
  //   message:   string, required
  //   title:     string, optional
  //   position:  [center, event, side]
  //   fadeTime:  (>= 1000 for autofade, null otherwise)
  //
  function sendAlert(options, severity) {

    if (options.message == null) {
      throw "Alerts must at least have a message"
    }

    // If we're running the specs the Browser won't exist, so if models send
    // alerts to the client it has to go through the Switchboard.
    Switchboard.render({
      type: 'alert',
      classname: severity,
      message: options.message,
      title: options.title,
      fadeTime: options.fadeTime,
      position: (options.position || 'side'),
    });
  }

  return {
    sendInfo,
    sendSuccess,
    sendWarning,
    sendError,
  }

})();

