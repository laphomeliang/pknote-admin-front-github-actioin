const exec = require('@actions/exec')
const io = require('@actions/io')
const core = require('@actions/core')
try {
    new Promise(async function (resolve, reject) {
        const gitPath = await io.which('git', true)
        const args1 = ['clone', `https://github.com/${ process.env.GITHUB_REPOSITORY }`, `${ process.env.GIT_CLONE_PATH }/${ process.env.GITHUB_REPOSITORY }`]
        const gitFilePath = `"${gitPath}"`
        await exec.exec(gitFilePath, args1)
        core.info('🚀 clone code from repository success!')
    })
} catch (error) {}