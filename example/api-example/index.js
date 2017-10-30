const path = require('path');
const fs = require('fs');

const htmlMinifier = require('../../lib/index.js').default;

let html = fs.readFileSync(path.join(__dirname, 'app.html')).toString();

let output = htmlMinifier({
    src: html
});
console.log(output);

htmlMinifier({
    srcPath: path.join(__dirname, 'app.html'),
    isPath: true,
    outputPath: path.join(__dirname, 'output.html')
});
