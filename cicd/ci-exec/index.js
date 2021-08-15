const fs = require('fs')
const exec = require('@actions/exec')
const io = require('@actions/io')
const core = require('@actions/core')

try {
    core.info('48484')
    const gitPath = getGit()
    core.info(gitPath)
    const args = ['diff', '--name-only']
    const pathArr = execFunc(gitPath, args)
    core.info(pathArr)
    // io.which('git', true).then((gitPath) => {
    //     core.info('gitPath')
    //     core.info(gitPath)
    //     core.info(process.env.GITHUB_SHA)
    //     const args = ['diff', '--name-only']
    //     // const args = ['log']
    //     exec.exec(`"${gitPath}"`, args).then((pathArr) => {
    //         core.info(pathArr)
    //     })
    // })
} catch (error) {
    
}

async function getGit() {
    return await io.which('git', true)
}

async function execFunc(gitPath, args) {
    return await exec.exec(gitPath, args)
}