const { app } = require('electron');

global.ROOT = require('path').normalize(`${__dirname}`).replace(/\\/g,"/");
global.DATA = app.getPath("userData")
global.ENVIRONMENT = process.argv.includes('--development') ? 'development' : 'production';
global.VERSION = "0.0.0";

// We first boot Onyx by loading all of the JavaScript objects into memory. My
// style of doing things is odd by modern standards I know. I really just
// prefer to put all the "classes" into the global scope that way they can be
// accessed from anywhere without requiring things.
require(`${ROOT}/engine/boot.js`);
