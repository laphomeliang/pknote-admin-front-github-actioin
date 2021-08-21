const fs = require('fs');
const os = require('os');
const filePath = process.env[`GITHUB_ENV`]
const gitClonePath = './public/action'
fs.appendFileSync(filePath, `ACTIONS_RUNTIME_URL=${process.env.ACTIONS_RUNTIME_URL}${os.EOL}`, {
    encoding: 'utf8'
})
fs.appendFileSync(filePath, `ACTIONS_RUNTIME_TOKEN=${process.env.ACTIONS_RUNTIME_TOKEN}${os.EOL}`, {
    encoding: 'utf8'
})
fs.appendFileSync(filePath, `GITHUB_RUN_ID=${process.env.GITHUB_RUN_ID}${os.EOL}`, {
    encoding: 'utf8'
})
fs.appendFileSync(filePath, `GIT_CLONE_PATH=${gitClonePath}${os.EOL}`, {
    encoding: 'utf8'
})