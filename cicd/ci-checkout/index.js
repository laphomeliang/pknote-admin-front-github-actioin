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
            let myOutput = ''
            let myLine = ''
            const options = {
                cwd: './public/action',
                listeners: {
                    stdout: data => {
                        myOutput += data.toString();
                    },
                    stdline: data => {
                        myLine += data.toString();
                    }
                }
            }
            await exec.exec(gitFilePath, args2, options)
            core.info(':rocket: clone code from repository success!')
            core.info(myOutput)
            core.info(myLine)
        }, 2000);
    })
} catch (error) {}