const core = require('@actions/core');
const toggleProtection = require('./toggle-protection');


// most @actions toolkit packages have async methods
async function run() {
  try {
    // get inputs
    const owner = core.getInput('owner');
    const repo = core.getInput('repo');
    const branch = core.getInput('branch');
    const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN');
    const on = core.getInput('on');
    const off = core.getInput('off');

    core.debug('Input:', owner, repo, branch, GITHUB_TOKEN, on, off);
    const output = await toggleProtection({ owner, repo, branch, GITHUB_TOKEN, on, off });
    core.debug('Output', output);

    core.setOutput('on', output.on ? output.on : output.nice);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
