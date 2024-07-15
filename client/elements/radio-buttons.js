window.RadioButtons = function(options) {

  // RadioButtons have the following options:
  //   currentValue:  Currently selected value.
  //   onSelect:      Select callback, only triggers when value changes.
  //   choices:       [{ label:'Yes', value:'Y' },...]
  const $onSelect = options.onSelect;
  const $element = X.createElement(`<div class='radio-buttons'></div>`);

  let $currentValue = options.currentValue;

  (options.choices||[]).forEach(choice => {
    addChoice(choice);
  });

  function getElement() { return $element; }
  function getValue() { return $currentValue; }

  function addChoice(choice) {
    const button = X.createElement(`<a href='#' class='radio-button'>`)
    button.setAttribute('data-value',choice.value);
    button.innerHTML = choice.label;
    button.addEventListener('click', event => {
      setValue(event.target.getAttribute('data-value'));
    });

    if (choice.value === $currentValue) {
      X.addClass(button,'on');
    }

    $element.appendChild(button);
  }

  function setValue(value) {
    if (value !== $currentValue) {
      $currentValue = value;

      const other = $element.querySelector('.on');
      if (other) {
        X.removeClass(other,'on');
      }

      X.addClass($element.querySelector(`.radio-button[data-value="${value}"]`),'on')
      if ($onSelect) {
        $onSelect({ radioButtons:this, value:value });
      }
    }
  }

  return Object.freeze({
    getElement,
    getValue,
    addChoice,
    setValue,
  });

}
