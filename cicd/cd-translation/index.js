const core = require('@actions/core')

try {
    new Promise(async function (resolve, reject) {
        core.info(`${ process.env.GIT_CLONE_PATH }`)
    })
} catch (error) {
    
}