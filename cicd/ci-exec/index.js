const exec = require('@actions/exec')
const io = require('@actions/io')
const core = require('@actions/core')

try {
    const gitPath = await io.which('git', true)
    const args = ['diff', '--name-only', "HEAD~ HEAD"]
    exec.exec(`"${gitPath}"`, args, options).then((pathArr) => {
        core.info(pathArr)
    })
} catch (error) {
    
}