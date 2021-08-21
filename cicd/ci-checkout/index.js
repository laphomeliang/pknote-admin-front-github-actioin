const fs = require('fs')
const os = require('os');
const filePath = process.env[`GITHUB_ENV`]
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
            const options = {
                cwd: './public/action',
                listeners: {
                    stdout: data => {
                        myOutput = data.toString();
                    }
                }
            }
            await exec.exec(gitFilePath, args2, options)
            core.info(':rocket: clone code from repository success and get the commited path!')
            core.info(myOutput)
            // fs.appendFileSync(filePath, `COMMIT_PATHS=${myOutput}${os.EOL}`, {
            //     encoding: 'utf8'
            // })
        }, 2000);
    })
} catch (error) {}