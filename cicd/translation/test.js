const fs = require('fs')
function readFile(path) {
    return fs.readFileSync(path, 'utf8')
}
const paths = ['index.js','package.json']
const fileTxts = paths.map(path => readFile(path))
console.log(fileTxts)