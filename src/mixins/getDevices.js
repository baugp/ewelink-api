const { _get, timestamp } = require('../helpers/utilities');
const errors = require('../data/errors');

module.exports = {
  /**
   * Get all devices information
   *
   * @returns {Promise<{msg: string, error: number}|*>}
   */
  async getDevices() {
    const { APP_ID } = this;

    const response = await this.makeRequest({
      uri: '/device/thing',
    });

    const error = _get(response, 'error', false);
    const devicelist = _get(response, 'data.thingList', false);

    if (error) {
      return { error, msg: errors[error] };
    }

    if (!devicelist) {
      return { error: 404, msg: errors.noDevices };
    }

    return devicelist;
  },
};
