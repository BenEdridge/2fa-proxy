const openpgp = require('openpgp');

const pubkey = `-----BEGIN PGP PUBLIC KEY BLOCK-----
...
-----END PGP PUBLIC KEY BLOCK-----
`;

  const encryptDecryptFunction = async(key) => {

    await openpgp.initWorker({ path:'openpgp.worker.js' }) // set the relative web worker path
    const publicKeys = await (await openpgp.key.readArmored(key)).keys

    const options = {
        message: openpgp.message.fromText('Hello, World!'),       // input as Message object
        publicKeys
    }

    openpgp.encrypt(options)
    .then(ciphertext => {
        let encrypted = ciphertext.data;
        console.log(encrypted);
    }).catch(e => {
      console.error('Failure to encrypt', e);
    })
    
}

encryptDecryptFunction(pubkey).then(res => console.log('Complete'))