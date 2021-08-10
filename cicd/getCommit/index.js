const core = require('@actions/core')
const github = require('@actions/github')

try {
    const ref = github.ref
    core.warning('myInput was not set');
    core.info(ref)
    // const myInput = core.getInput('inputName', { required: true });
    // const myBooleanInput = core.getBooleanInput('booleanInputName', { required: true });
    // const myMultilineInput = core.getMultilineInput('multilineInputName', { required: true });
    // core.setOutput('outputKey', 'outputVal');
} catch(err) {

}