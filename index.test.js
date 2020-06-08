const toggleProtection = require('./toggle-protection');

const MOCK_RULES = '{"url":"https://api.github.com/repos/zalari/action-toggle-branch-protection/branches/master/protection","required_pull_request_reviews":{"url":"https://api.github.com/repos/zalari/action-toggle-branch-protection/branches/master/protection/required_pull_request_reviews","dismiss_stale_reviews":false,"require_code_owner_reviews":false,"required_approving_review_count":1},"enforce_admins":{"url":"https://api.github.com/repos/zalari/action-toggle-branch-protection/branches/master/protection/enforce_admins","enabled":false},"required_linear_history":{"enabled":false},"allow_force_pushes":{"enabled":false},"allow_deletions":{"enabled":false}}';

const MOCK_RULES_TOO = "{\"url\":\"https://api.github.com/repos/zalari/action-toggle-branch-protection/branches/master/protection\",\"required_status_checks\":{\"url\":\"https://api.github.com/repos/zalari/action-toggle-branch-protection/branches/master/protection/required_status_checks\",\"strict\":false,\"contexts\":[\"test\"],\"contexts_url\":\"https://api.github.com/repos/zalari/action-toggle-branch-protection/branches/master/protection/required_status_checks/contexts\"},\"required_pull_request_reviews\":{\"url\":\"https://api.github.com/repos/zalari/action-toggle-branch-protection/branches/master/protection/required_pull_request_reviews\",\"dismiss_stale_reviews\":false,\"require_code_owner_reviews\":false,\"required_approving_review_count\":1},\"enforce_admins\":{\"url\":\"https://api.github.com/repos/zalari/action-toggle-branch-protection/branches/master/protection/enforce_admins\",\"enabled\":false},\"required_linear_history\":{\"enabled\":false},\"allow_force_pushes\":{\"enabled\":false},\"allow_deletions\":{\"enabled\":false}}";

describe('toggleProtection', () => {

  it('should return a stringified protection object for passing off', async () => {

    const { on } = await toggleProtection({
      off: true,
      repo: 'action-toggle-branch-protection',
      branch: 'master',
      owner: 'zalari'
    });

    expect(on)
      .toEqual(MOCK_RULES_TOO);

  });

  it('should resolve passing on', async () => {

    const response = await toggleProtection({
      // on: JSON.stringify({
      //   required_status_checks: null,
      //   enforce_admins: null,
      //   required_pull_request_reviews: null,
      //   restrictions: null
      // }),
      on: MOCK_RULES_TOO,
      repo: 'action-toggle-branch-protection',
      branch: 'master',
      owner: 'zalari'
    });

    expect(response).toEqual({nice: true});


  });

});
