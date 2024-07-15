window.global = window

// The server will try and write a few messages to the log before the client
// has a chance to load and initialize all the components, so we need to to
// make sure the console exists before invoking it.
ServerEvents.onLog((event, logData) => {
  if (window.Console) { Console.append(logData); }
});

ServerEvents.onBoot((event, fileList) => {
  try {
    loadAll(fileList).then(() => { initializeAll() });
  } catch(error) {
    console.error("\n!!! Error Booting Client Process !!!\n");
    console.error(e);
  }
});

ServerEvents.onReady((event, context) => {
  window.Environment = context.environment;
  window.WorldState = context.worldState;

  log(`Onyx started in ${Environment.name} mode.`,{ system:'Boot', level:1 });

  document.title = Environment.isDevelopment ? 'Onyx (Development)' : 'Onyx'
  X.remove('.loading');

  MainMenu.setContext(context);
  MainContent.setStage(MainMenu);
  OptionsOverlay.build();
});

// Import all of the scripts that are used on the client side, this includes a
// few files from the engine side because we want to be able to use the same
// model and utility classes.
function loadAll(fileList) {
  return new Promise(async resolve => {
    console.log("=== Booting Client ===");
    console.log(`Importing ${fileList.length} source files.`)

    // We use async/await here because these files are imported sequentially.
    // Promise.all() would load all of these files in parallel which would
    // sometimes blow up.
    for (const file of fileList) {
      await import(`../${file}`);
    }

    resolve();
  });
}

// Now that all the files have been imported we can run the init() methods on
// all the files. Then tell the server that the client has finished loading.
// This event requests the context from the server in order to call the ready()
// function below.
function initializeAll() {
  Console.init();
  Renderer.init();
  ServerTriggers.init();

  ClientModules.initAll();
  Elements.initAll();
  Views.initAll();

  ClientCommands.sendReady();
}

// This is the command that starts everything. It sends the boot message to the
// server which replies with a list of files to load.
ClientCommands.sendBoot();
