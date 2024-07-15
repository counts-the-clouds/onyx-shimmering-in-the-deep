window.Template = (function() {

  function load(selector, templatePath) {
    let element = X.first(selector);
    if (element == null) {
      console.error(`Cannot load template into ${selector}`);
      console.error(`Parent element does not exist.`);
      return;
    }

    return new Promise(resolve => {
      ClientCommands.loadTemplate(templatePath).then(template => {
        element.innerHTML = template;
        resolve();
      });
    });
  }

  return {
    load: load
  };

})();
