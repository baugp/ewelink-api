const WebSocket = require('../classes/WebSocket');
const wssLoginPayload = require('../payloads/wssLoginPayload');
const wssUpdatePayload = require('../payloads/wssUpdatePayload');
const errors = require('../data/errors');

module.exports = {
  async refreshDevice(deviceId, period_sec = 60) {
    const device = await this.getDevice(deviceId);
    const payloadLogin = wssLoginPayload({ at: this.at, apiKey: this.apiKey, appid: this.APP_ID });
    const payloadUpdate = wssUpdatePayload({
      apiKey: this.apiKey,
      deviceApiKey: device.apikey,
      deviceId,
      params: { uiActive: period_sec },
    });

    const response = await WebSocket.WebSocketRequest(this.getApiWebSocket(), [
      payloadLogin,
      payloadUpdate,
    ]);

    var resIdx = 1;
    var msg = 'unknown error';
    for (var i = 0; i < response.length; i++) {
      if ('error' in response[i]) {
        resIdx = i;
        if (response[i].error != 0) {
          if (response[i].error in errors) {
            msg = errors[response[i].error];
          }
        } else {
          msg = 'ok';
        }
        break;
      }
    }
    return {error: response[resIdx].error, msg: msg};
  },
};
