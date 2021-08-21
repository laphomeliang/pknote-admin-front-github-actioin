const fs = require('fs')
const exec = require('@actions/exec')
const io = require('@actions/io')
const core = require('@actions/core')

try {
    new Promise(async function (resolve, reject) {
        const gitPath = await io.which('git', true)
        console.log(gitPath)
        const args1 = ['clone', `https://github.com/${ process.env.GITHUB_REPOSITORY }`, './public/action']
        const gitFilePath = `"${gitPath}"`
        await exec.exec(gitFilePath, args1)
        setTimeout(async () => {
            const args2 = ['diff', '--name-only', 'HEAD~', 'HEAD']
            await exec.exec(gitFilePath, args2, { cwd: './public/action' })
            core.info(':rocket: clone code from repository success!')
        }, 2000);
    })
} catch (error) {}