global.expect = require('chai').expect;
global.fs = require('fs');
global.ROOT = require('path').normalize(`${__dirname}`).replace(/\\/g,"/");
global.DATA = `${ROOT}/test`
global.ENVIRONMENT = 'test';

require(`${ROOT}/engine/boot.js`);
require(`${ROOT}/fixtures/spec-helper.js`);

before(async function() {
  await SpecHelper.clearTestFile('dungeonState.json');
  await SpecHelper.clearTestFile('gameState.json');
  await SpecHelper.clearTestFile('worldState.json');
  await WorldState.reset();
});
