const openpgp = require('openpgp');

const encrypt = async (key, message) => {

  let ciphertext = 'FAILED_ENCRYPTION :(';

  const options = {
    message: openpgp.message.fromText(message),
    publicKeys: (await openpgp.key.readArmored(key)).keys
  };

  try {
    ciphertext = await openpgp.encrypt(options);
  } catch (e) {
    console.error(`Encryption Failed: ${e}`);
    throw (e);
  }
  return ciphertext.data;
}

module.exports = {
  encrypt
}