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
  static async get({ apiUrl, at, apiKey, deviceApiKey, deviceId, appid }) {
    const payloadLogin = wssLoginPayload({ at, apiKey, appid });

    const payloadUpdate = wssUpdatePayload({
      apiKey,
      deviceApiKey,
      deviceId,
      params: { hundredDaysKwh: 'get' },
    });

    const response = await this.WebSocketRequest(apiUrl, [
      payloadLogin,
      payloadUpdate,
    ]);

    var resIdx = 0;
    for (var i = 0; i < response.length; i++) {
      if ('error' in response[i] && response[i].error != 0) {
        // console.log(response);
        var ret = { error: response[i].error };
        if (response[i].error in errors) {
          ret['msg'] = errors[response[i].error];
        }
        return ret;
      }

      if ('config' in response[i]) {
        if ('hundredDaysKwhData' in response[i].config) {
          resIdx = i;
          break;
        }
      }
    }

    const hundredDaysKwhData = _get(
      response[resIdx],
      'config.hundredDaysKwhData',
      false
    );

    if (!hundredDaysKwhData) {
      // console.log(response);
      return { error: 404, msg: errors.noPower };
    }

    return {
      status: 'ok',
      data: { hundredDaysKwhData },
    };
  }
}

module.exports = DevicePowerUsageRaw;
