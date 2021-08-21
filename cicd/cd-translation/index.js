const core = require('@actions/core')

try {
    new Promise(async function (resolve, reject) {
        core.info(`${ process.env.COMMIT_PATHS }`)
    })
} catch (error) {
    
}