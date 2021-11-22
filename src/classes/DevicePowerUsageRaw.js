const WebSocket = require('./WebSocket');
const wssLoginPayload = require('../payloads/wssLoginPayload');
const wssUpdatePayload = require('../payloads/wssUpdatePayload');
const { _get } = require('../helpers/utilities');
const errors = require('../data/errors');

class DevicePowerUsageRaw extends WebSocket {
  /**
   * Get specific device power usage (raw data)
   *
   * @param apiUrl
   * @param at
   * @param apiKey
   * @param deviceId
   * @returns {Promise<{error: string}|{data: {hundredDaysKwhData: *}, status: string}|{msg: any, error: *}|{msg: string, error: number}>}
   */
  static async get({ apiUrl, at, apiKey, deviceId, appid }) {
    const payloadLogin = wssLoginPayload({ at, apiKey, appid });

    const payloadUpdate = wssUpdatePayload({
      apiKey,
      deviceId,
      params: { hundredDaysKwh: 'get' },
    });

    const response = await this.WebSocketRequest(apiUrl, [
      payloadLogin,
      payloadUpdate,
    ]);

    if (response.length === 1) {
      return { error: errors.noPower };
    }

    var resIdx = 1;
    if (response.length > 2) {
      // find the right response
      for (var i = 0; i < response.length; i++) {
        if ('config' in response[i]) {
          if ('hundredDaysKwhData' in response[i].config) {
            resIdx = i;
            break;
          }
        }
      }
    }

    const error = _get(response[resIdx], 'error', false);

    if (error === 403 || error === 503) {
      return { error, msg: response[resIdx].reason };
    }

    const hundredDaysKwhData = _get(
      response[resIdx],
      'config.hundredDaysKwhData',
      false
    );

    if (!hundredDaysKwhData) {
      return { error: errors.noPower };
    }

    return {
      status: 'ok',
      data: { hundredDaysKwhData },
    };
  }
}

module.exports = DevicePowerUsageRaw;
