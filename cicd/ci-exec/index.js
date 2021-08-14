const exec = require('@actions/exec')
const io = require('@actions/io')
const core = require('@actions/core')

try {
    io.which('git', true).then((gitPath) => {
        core.info(gitPath)
        core.info(process.env.GITHUB_SHA)
        const args = ['diff', '--name-only', `1ece854ab7f5174a83ee2eefadd6e67fbd9e277d~ ${process.env.GITHUB_SHA}`]
        // const args = ['log']
        exec.exec(`"${gitPath}"`, args).then((pathArr) => {
            core.info(pathArr)
        })
    })
} catch (error) {
    
}