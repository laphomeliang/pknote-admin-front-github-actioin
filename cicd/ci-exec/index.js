const exec = require('@actions/exec')
const io = require('@actions/io')
const core = require('@actions/core')

try {
    io.which('git', true).then((gitPath) => {
        core.info(gitPath)
        const args = ['diff', '--name-only', "HEAD~ HEAD"]
        exec.exec(`"${gitPath}"`, args, options).then((pathArr) => {
            core.info(pathArr)
        })
    })
} catch (error) {
    
}