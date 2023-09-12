const fetch = require('node-fetch');

const { _get, nonce } = require('../helpers/utilities');
const credentialsPayload = require('../payloads/credentialsPayload');
const { makeAuthorizationSign } = require('../helpers/ewelink');
const errors = require('../data/errors');

module.exports = {
  /**
   * Returns user credentials information
   *
   * @returns {Promise<{msg: string, error: *}>}
   */
  async getCredentials() {
    const { APP_ID, APP_SECRET } = this;

    const body = {
      email: this.email,
      password: this.password,
      countryCode: this.countryCode,
    };

    const request = await fetch(`${this.getApiUrl()}/user/login`, {
      method: 'post',
      headers: {
        Authorization: `Sign ${makeAuthorizationSign(APP_SECRET, body)}`,
        'X-CK-Appid': APP_ID,
        'X-CK-Nonce': nonce,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
    });

    let response = await request.json();

    const error = _get(response, 'error', false);
    const region = _get(response, 'data.region', false);

    if (error && [400, 401, 404].indexOf(parseInt(error)) !== -1) {
      return { error: 406, msg: errors['406'] };
    }

    if (error && parseInt(error) === 301 && region) {
      if (this.region !== region) {
        this.region = region;
        response = await this.getCredentials();
        return response;
      }
      return { error, msg: 'Region does not exist' };
    }

    this.apiKey = _get(response, 'data.user.apikey', '');
    this.at = _get(response, 'data.at', '');
    return response;
  },
};
