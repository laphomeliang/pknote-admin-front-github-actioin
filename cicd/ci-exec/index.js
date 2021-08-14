const exec = require('@actions/exec')
const io = require('@actions/io')
const core = require('@actions/core')

try {
    io.which('git', true).then((gitPath) => {
        core.info(gitPath)
        core.info(process.env.GITHUB_SHA)
        const args = ['diff', '--name-only', `HEAD~ ${process.env.GITHUB_SHA}`]
        exec.exec(`"${gitPath}"`, args).then((pathArr) => {
            core.info(pathArr)
        })
    })
} catch (error) {
    
}