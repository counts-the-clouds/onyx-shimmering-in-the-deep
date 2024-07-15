global.SpecHelper = (function() {

  function clearTestFile(path) {
    const file = `${DATA}/${path}`;

    return new Promise(resolve => {
      fs.exists(file, existence => {
        if (!existence) { return resolve(); }
        fs.unlink(file, error => { resolve(); });
      });
    });
  }

  function tenTimes(done, testFunction) {
    let times = Environment.isVerbose() ? 10 : 1
    let tests = [];

    for (let i=0; i<times; i++) {
      tests.push(new Promise(resolve => {
        testFunction(resolve);
      }));
    }

    Promise.all(tests).then(()=>{ done(); });
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  return {
    clearTestFile,
    tenTimes,
    sleep,
  }

})();
