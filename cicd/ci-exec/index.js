const fs = require('fs')
const exec = require('@actions/exec')
const io = require('@actions/io')
const core = require('@actions/core')

try {
    core.info('48484')
    new Promise(async function (resolve, reject) {
        const gitPath = await io.which('git', true)
        console.log(gitPath)
        const args = ['diff', '--name-only', '1c78540b51d2a47e88e4d5149bfed5fa50d9ea1a~', '371eb347b5d09c5a84c9e8b1e2c106b11e163dcc'
    ]
        const gitFilePath = `"${gitPath}"`
        const pathArr = `${ await exec.exec(gitFilePath, args)}`
        core.info(pathArr)
    })
    // io.which('git', true).then((gitPath) => {
    //     core.info('gitPath')
    //     core.info(gitPath)
    //     core.info(process.env.GITHUB_SHA)
    //     const args = ['diff', '--name-only']
    //     // const args = ['log']
    //     exec.exec(`"${gitPath}"`, args).then((pathArr) => {
    //         core.info('pathArr')
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