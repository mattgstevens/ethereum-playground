const createKeccakHash = require('keccak')
const secp256k1 = require('secp256k1')

const privateKey = process.argv[2]
if (!privateKey) {
  console.log('must provide privateKey as a hex string')
  // https://nodejs.org/api/process.html#process_exit_codes
  // Invalid Argument - Either an unknown option was specified, or an option requiring a value was provided without a value.
  process.exit(9)
}

const privateKeyBuffer = new Buffer(privateKey, 'hex')
// need to remove leading 0 byte
const pubKey = secp256k1.publicKeyCreate(privateKeyBuffer, false).slice(1)

const address = createKeccakHash('keccak256')
  .update(pubKey)
  .digest()
  // address is last 20 bytes
  .slice(-20)
  .toString('hex')

console.log('public key:', address)
