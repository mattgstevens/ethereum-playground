const bip39 = require('bip39')
const hdkey = require('ethereumjs-wallet/hdkey')

const mnemonic = process.argv[2]
if (!mnemonic) {
  console.log('must provide 12 word mnemonic')
  // https://nodejs.org/api/process.html#process_exit_codes
  // Invalid Argument - Either an unknown option was specified, or an option requiring a value was provided without a value.
  process.exit(9)
}

const hdwallet = hdkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic))
const path = "m/44'/60'/0'/0/0"
const wallet = hdwallet.derivePath(path).getWallet()
const address = `0x${wallet.getAddress().toString('hex')}`
const privateKey = `${wallet.getPrivateKey().toString('hex')}`

console.log(`Address: ${address}`)
// Probably better that you use this in a repl, there are other interesting things in the `wallet`
// and you might not always want the zero index wallet in `path`.
//
// Leaving zero index as the default here as often the hd-wallets I use for development only use one :)
//
// console.log(`Private key: ${privateKey}`)
