#! /usr/bin/env node

global.fs = require('fs');

require('../engine/helpers/file-helper.js');

const ROOT = require('path').normalize(`${__dirname}`).replace(/\\/g,"/").replace(/\/bin/,'');

let fileList = [];

console.log("=== Generating Clientside FileList ===");

addFile('engine/core/constants.js');
addFile('client/constants.js');
addFile('client/renderer.js');

addFiles('engine/models');
addFiles('engine/members/registries');
addFiles('engine/helpers');
addFiles('client/components');
addFiles('client/effects');
addFiles('client/elements');
addFiles('client/tools');
addFiles('client/modules');
addFiles('client/views');
addFiles('data/events');
addFiles('data/notes');
addFiles('data/tiles');
addFiles('data/triggers');

// In paths that contain the project name, we need to convert the absolute
// paths to relative paths from the project root.
let index = fileList[fileList.length-1].indexOf('onyx') + 27;
fileList = fileList.map(file => {
  return file.includes('onyx') ? file.substring(index) : file;
});

console.log(`Writing list of ${fileList.length} source files.`)
console.log(fileList);

// Finally write this file list as a JSON file.
FileHelper.writeJSON(`${ROOT}/client-source-files.json`, { fileList });

function addFile(path) { fileList.push(path); }
function addFiles(path) { fileList = fileList.concat(FileHelper.recursiveFileList(`${ROOT}/${path}`)); }
