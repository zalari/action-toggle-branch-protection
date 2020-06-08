const { Octokit } = require('@octokit/rest');

const branchDoesNotHaveProtection = (errorObj) => {
  const hasStatus = errorObj.status !== undefined;
  return hasStatus && errorObj.toString() === 'HttpError: Branch not protected';
};

const transformOutputRules = (outputRules) => {
  const result = {};
  // result must be -> https://developer.github.com/v3/repos/branches/#update-branch-protection

  // map simple boolean props from {prop: {enabled: false|true} to {prop: false | true}
  const simpleBooleanProps = [
    'allow_deletions',
    'allow_force_pushes',
    'required_linear_history',
    'enforce_admins'
  ].forEach(booleanProp => {
    if (booleanProp in outputRules) {
      result[booleanProp] = outputRules[booleanProp].enabled;
    }
  });

  // handle special object-based props
  if ('required_status_checks' in outputRules) {
    const { contexts_url, ...payload } = outputRules['required_status_checks'];
    result['required_status_checks'] = { ...payload };
  } else {
    result['required_status_checks'] = null;
  }

  if ('required_pull_request_reviews' in outputRules) {
    const { url, ...payload } = outputRules['required_pull_request_reviews'];
    result['required_pull_request_reviews'] = { ...payload };
  } else {
    result['required_pull_request_reviews'] = null;
  }
  if ('restrictions' in outputRules) {
    const { url, users_url, apps_url, ...payload } = outputRules['restrictions'];
    result['restrictions'] = { ...payload };
  } else {
    result['restrictions'] = null;
  }

  return result;


};

const disableProtection = async function ({ owner, repo, branch, auth }) {
  const octokit = new Octokit({
    auth,
    previews: ['luke-cage-preview']
  });
  // await currentProtection and then delete branchProtection
  let branchProtectionRules = {};
  try {
    const branchProtectionResponse = await octokit.repos.getBranchProtection({
      owner,
      repo,
      branch
    });
    branchProtectionRules = branchProtectionResponse.data;
    // now delete rules
    await octokit.repos.deleteBranchProtection({
      owner,
      repo,
      branch
    });
  } catch (errorResponse) {
    // be gracious about branches not actually being protected and rethrow
    if (!branchDoesNotHaveProtection(errorResponse)) {
      throw errorResponse;
    }
  }
  // console.log(branchProtectionRules);
  return { on: JSON.stringify(branchProtectionRules) };
};


const enableProtection = async function ({ owner, repo, branch, protectionRules, auth }) {
  // console.log('Got initial rules: %o', protectionRules);
  const transformedRules = transformOutputRules(protectionRules);
  // console.log('real rules: %o', transformedRules);
  const octokit = new Octokit({
    auth,
    previews: ['luke-cage-preview']
  });
  // set branch protection for passed rules
  await octokit.repos.updateBranchProtection({
    owner,
    repo,
    branch,
    ...transformedRules
  });
  return { nice: true };
};

const toggleProtection = async function ({ on, off, owner, repo, branch, GITHUB_TOKEN }) {
  if (off) {
    return disableProtection({ owner, repo, branch, auth: GITHUB_TOKEN });
  } else {
    return enableProtection({ owner, repo, branch, protectionRules: JSON.parse(on), auth: GITHUB_TOKEN });
  }
};

module.exports = toggleProtection;
