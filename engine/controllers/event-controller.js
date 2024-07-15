global.EventController = (function() {

  function init() {
    ipcMain.handle("event.finished", eventFinished);
  }

  function eventFinished(payload, eventData, state) {
    localLog("finished", {eventData, state});
    TileEvent.unpack(eventData).onServerFinish(state);
  }

  function localLog(action, data=null) {
    log(action,{ system:'DungeonController', data:data });
  }

  return { init };

})();