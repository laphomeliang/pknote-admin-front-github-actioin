const exec = require('@actions/exec')
const io = require('@actions/io')
const core = require('@actions/core')
const Translater = require('../translation/index')

try {
    core.info('88888!')
    new Promise(async function (resolve, reject) {
        const gitPath = await io.which('git', true)
        const gitFilePath = `"${gitPath}"`
        const args2 = ['diff', '--name-only', 'HEAD~', 'HEAD']
        let myOutput = ''
        const options = {
            cwd: `${ process.env.GIT_CLONE_PATH }`,
            listeners: {
                stdout: data => {
                    myOutput = data.toString();
                }
            }
        }
        await exec.exec(gitFilePath, args2, options)
        core.info('get the commit file paths!')
        const paths = splitPaths(myOutput)
        const translatePaths = filterPath(paths)
        new Translater(translatePaths)
    })
} catch (error) {
    core.error(error)
}

// get all paths of commit files
function splitPaths(str) {
    const arr = str.split(/\s+/g)
    return arr.map(s => s.trim()).filter(s => s)
}
// filter unnecessary paths
function filterPath(arr) {
    return arr
}