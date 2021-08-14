const exec = require('@actions/exec')
const io = require('@actions/io')
const core = require('@actions/core')

try {
    io.which('git', true).then((gitPath) => {
        core.info(gitPath)
        core.info(process.env.GITHUB_SHA)
        const args = ['diff', '--name-only', `1d78bf20b45e36a034e5bd5e5b4e18d665f180c2`, `${process.env.GITHUB_SHA}`]
        // const args = ['log']
        exec.exec(`"${gitPath}"`, args).then((pathArr) => {
            core.info(pathArr)
        })
    })
} catch (error) {
    
}