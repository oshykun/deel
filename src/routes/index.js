const fs = require('fs');
const path = require('path');

/**
 * @return Array of api routes functions
 * */
module.exports = () => fs.readdirSync(__dirname).
    filter(file => file.includes('.') && file !== 'index.js').
    map(file => require(path.join(__dirname, file)));
