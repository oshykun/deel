const fs = require('fs');
const path = require('path');

// load and run all initializers
module.exports = app => fs.readdirSync(__dirname).
    filter(file => file.includes('.') && file !== 'index.js').
    forEach(file => {
      const initializer = require(path.join(__dirname, file));
      if (typeof initializer === 'function') {
        initializer(app);
      }
    });
