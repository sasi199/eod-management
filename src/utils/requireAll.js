const fs = require('fs');
const path = require('path');
const glob = require('glob');

function requireAll(pattern) {
  const modules = {};

  // Resolve the caller's directory
  const callerDir = path.dirname(module.parent.filename);

  // Resolve the pattern relative to the caller's directory
  const resolvedPattern = path.resolve(callerDir, pattern).replace(/\\/g, '/');

//   console.log(resolvedPattern,"resolvedPattern");
//   console.log(glob.sync(resolvedPattern),"glob.sync(resolvedPattern)")
  // Use glob to find matching files
  glob.sync(resolvedPattern).forEach((file) => {
    // console.log(file,"sd")
    // Check if it's a file (not a directory) and ends with .js or .ts
    if (fs.statSync(file).isFile() && /\.(js|ts)$/.test(file)) {
      const moduleName = path.basename(file, path.extname(file)); // Get file name without extension
      modules[moduleName] = require(file); // Dynamically require the file
    }
  });

  return modules;
}

module.exports = {requireAll};
