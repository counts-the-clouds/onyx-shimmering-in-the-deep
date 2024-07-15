window.Alert = function(options) {

  // TODO: May add other icons and shit in the future.
  const $title = options.title;
  const $message = options.message;
  const $position = options.position;
  const $classname = options.classname || '';
  const $fadeTime = options.fadeTime;

  let $dismissed = false;
  let $parent;

  if (options.position === 'center') { $parent = X.first('#centerAlerts'); }
  if (options.position === 'event') { $parent = X.first('#eventAlerts'); }
  if (options.position === 'side') { $parent = X.first('#sideAlerts'); }

  const $element = X.createElement(`<li class='alert ${$position} ${$classname}'></li>`);

  if ($title) {
    $element.appendChild(X.createElement(`<div class='title'>${$title}</div>`));
  }

  $element.appendChild(X.createElement(`<div class='message'>${$message}</div>`));
  $element.addEventListener('click', () => { dismiss(); });

  function display() {
    $parent.appendChild($element);

    if ($fadeTime) {
      setTimeout(() => { dismiss(); }, $fadeTime);
    }
  }

  // Remove the alert with a short fade effect. This should only happen once
  // per alert, either when clicked or the fade time is reached.
  function dismiss() {
    if ($dismissed) { return; }
    $dismissed = true;

    X.addClass($element,'fade');
    setTimeout(() => {
      $element.remove();
    }, 1000);
  }

  return Object.freeze({
    display,
    dismiss,
  });
}

Alert.showServerAlert = function(data) {
  log("New Alert",{ system:'Alert', data:data })
  new Alert(data).display();
}
