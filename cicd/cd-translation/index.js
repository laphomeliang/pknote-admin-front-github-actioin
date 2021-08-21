const exec = require('@actions/exec')
const io = require('@actions/io')
const core = require('@actions/core')

try {
    new Promise(async function (resolve, reject) {
        const gitPath = await io.which('git', true)
        const gitFilePath = `"${gitPath}"`
        const args2 = ['diff', '--name-only', 'HEAD~', 'HEAD']
        let myOutput = ''
        const options = {
            cwd: `${ process.env.GITHUB_REPOSITORY }`,
            listeners: {
                stdout: data => {
                    myOutput = data.toString();
                }
            }
        }
        await exec.exec(gitFilePath, args2, options)
        core.info('get the commit file paths!')
        splitPaths(myOutput)
    })
} catch (error) {}

function splitPaths(str) {
    const arr = str.split(/\s+/g)
    arr.forEach((s, i) => {
        core.info(`${ i }, ${ s }`)
    });
    
}