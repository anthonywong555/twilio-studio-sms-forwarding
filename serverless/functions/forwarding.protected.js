// This is your new function. To start, set the name and path on the left.
const qs = require('qs');
const axios = require('axios');
const crypto = require('crypto');

exports.handler = async (context, event, callback) => {
  let { url, payload } = event;

  try {
    const twilioSig = generateXTwilioSignature(context.AUTH_TOKEN, url, payload);
    const respone = await axios({
      url,
      method: 'POST',
      data: qs.stringify(payload),
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'X-Twilio-Signature': twilioSig 
      }
    });

    return callback(null, respone);
  } catch(error) {
    console.error(error);
    return callback(error);
  }

};

const generateXTwilioSignature = (authToken, url, payload) => {
  const data = Object.keys(payload)
    .sort()
    .reduce((acc, key) => acc + key + payload[key], url);

  // sign the string with sha1 using your AuthToken
  // base64 encode it
  const signature =  crypto.createHmac('sha1', authToken)
    .update(Buffer.from(data, 'utf-8'))
    .digest('base64');
  return signature;
}