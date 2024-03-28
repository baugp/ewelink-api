const { nonce, timestamp, _get } = require('../helpers/utilities');
const errors = require('../data/errors');

module.exports = {
  /**
   * Get information for a specific device
   *
   * @param deviceId
   * @returns {Promise<*|null|{msg: string, error: *}>}
   */
  async getDevice(deviceId) {
    if (this.devicesCache) {
      return this.devicesCache.find(dev => dev.deviceid === deviceId) || null;
    }

    const { APP_ID } = this;

    const device = await this.makeRequest({
      method: 'post',
      uri: '/device/thing',
      body: {
        thingList: [{
          itemType: 1,
          id: deviceId
        }]
      },
    });

    const error = _get(device, 'error', false);

    if (error) {
      return { error, msg: errors[error] };
    }

    return device.data.thingList[0].itemData;
  },
};
