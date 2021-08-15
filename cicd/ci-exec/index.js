const fs = require('fs')
const exec = require('@actions/exec')
const io = require('@actions/io')
const core = require('@actions/core')

try {
    core.info(fs.exists('./.git'))
    io.which('git', true).then((gitPath) => {
        core.info(gitPath)
        core.info(process.env.GITHUB_SHA)
        const args = ['diff', '--name-only']
        // const args = ['log']
        exec.exec(`"${gitPath}"`, args).then((pathArr) => {
            core.info(pathArr)
        })
    })
} catch (error) {
    
}