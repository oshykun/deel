const fs = require('fs');
const path = require('path');

module.exports = fs.readdirSync(__dirname).
    filter(file => file.includes('.') && file !== 'index.js').
    map(file => require(path.join(__dirname, file)));
