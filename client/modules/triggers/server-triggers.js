window.ServerTriggers = (function() {

  function init() {
    ServerEvents.onTrigger((event, data) => {
      try {
        TriggerRegistry.lookup(data.code).getTriggerFunction()(data);
      }
      catch(error) {
        logError("Error Executing Trigger",{ system:"ServerTriggers", data:{
          error: error.message,
          data: data,
        }});
      }
    });
  }

  return { init };

})();
