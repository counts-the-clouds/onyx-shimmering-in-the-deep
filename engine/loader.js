global.Loader = (function() {

  const complete = [];

  // Recursively load all the javascripts in a directory. This is nearly the
  // same thing that FileHelper.recursiveFileList() does, but at this point the
  // FileHelper isn't loaded, so might as well repeat the same code.
  function loadDirectory(path) {
    if (fs.existsSync(path)) {
      fs.readdirSync(path, { withFileTypes:true }).forEach(item => {
        if (item.isFile() && item.name.match(/\.js$/)) {
          loadFile(`${path}/${item.name}`);
        }
        if (item.isDirectory()) {
          loadDirectory(`${path}/${item.name}`);
        }
      })
    }
  }

  // Only require files once.
  function loadFile(path) {
    if (!complete.includes(path)) {
      complete.push(path);
      require(path);
    }
  }

  return {
    loadDirectory,
    loadFile
  };

})();
