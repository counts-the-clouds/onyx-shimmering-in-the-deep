global.Logger = (function() {

  let $logFile;

  function init() {
    if (Environment.name !== 'test') {
      $logFile = fs.createWriteStream(`${DATA}/onyx.log`, { flags:'w' });
    }
  }

  // Options
  //   level:  int     1:important, 2:normal(default), 3:trivial
  //   type:   string  _info(default), _success, _warning, _error
  //   system: string
  //   data:   object
  function log(message, options={}) {
    options.time = TimeHelper.getTimeString();
    options.data = options.data ? JSON.stringify(options.data, null, 1) : null;
    options.type = options.type || _info;
    const asString = inStringFormat(message,options);

    sendToClient(message,options);
    printToFile(asString,options);
    printToConsole(asString,options);
  }

  // Calls the normal log at the highest level with the type set to error.
  function logError(message, options={}) {
    options.level = 1;
    options.type = _error;
    log(message, options);
  }

  function sendToClient(message,options) {
    if (global.Browser && Environment.name !== 'test') {
      options.message = message;
      Browser.send('log',options);
    }
  }

  // When the message string is written to the log file, the error state and
  // data also need to be added to the log string.
  function printToFile(message,options) {
    if ($logFile) {
      if (options.data) { message += ` ${options.data}` }
      if (options.type === _error) { message = `[ERROR] ${message}` }
      $logFile.write(`${message}\n`);
    }
  }

  // Maybe only print to the console in test mode?
  function printToConsole(message,options) {
    if (options.data) { message += ` ${options.data}` }
    (options.type === _error) ? console.error(message) : console.log(message);
  }

  // Log messages printed to the log file and the console should be formatted
  // as strings.
  function inStringFormat(message,options) {
    return `${options.time} ` + (options.system ? `[${options.system}] ${message}` : message);
  }

  return {
    init,
    log,
    inStringFormat,
    printToConsole,
  };

})();

global.log = Logger.log;
global.logError = Logger.logError;
