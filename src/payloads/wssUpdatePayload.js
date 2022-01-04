const { timestamp } = require('../helpers/utilities');

const wssUpdatePayload = ({ apiKey, deviceApiKey, deviceId, params }) => {
  const payload = {
    action: 'update',
    apikey: deviceApiKey,
    deviceid: deviceId,
    selfApikey: apiKey,
    params,
    ts: timestamp,
    userAgent: 'app',
    sequence: Math.floor(timestamp * 1000),
  };
  return JSON.stringify(payload);
};

module.exports = wssUpdatePayload;
