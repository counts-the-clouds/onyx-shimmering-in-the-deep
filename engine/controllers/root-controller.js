global.RootController = (function() {

  function init() {
    ipcMain.handle('client.boot', clientBoot);
    ipcMain.handle("client.ready", clientReady);
    ipcMain.handle("client.loadTemplate", loadTemplate);
    ipcMain.handle("options.save", optionsSave);
  }

  function clientBoot() {
    localLog('boot');
    FileHelper.readJSON(`${ROOT}/client-source-files.json`).then(sourceFiles => {
      Browser.send('server.boot',sourceFiles.fileList);
    });
  }

  function clientReady() {
    localLog('ready');
    Browser.send('server.ready', {
      environment: Environment.pack(),
      worldState: WorldState.getCurrentState(),
    });
  }

  function loadTemplate(event, path) {
    localLog('loadTemplate',path);
    return Template.load(path);
  }

  function optionsSave(event, options) {
    localLog('options.save',options);
    WorldState.setOptions(options);
    WorldState.saveState();

    return { status:_success, worldState:WorldState.getCurrentState() };
  }

  function localLog(action, data=null) {
    log(action,{ system:'RootController', data:data });
  }

  return { init };

})();
