const logLabel = label =>
  console.log(`\n${label}:\n${'-'.repeat(label.length)}\n`)

const logWithLabel = (label, ...x) => (
  logLabel(label), console.log(x.join('\n'), '\n')
)

const logDataWithLabel = (label, x) => (
  logLabel(label), console.log(JSON.stringify(x, null, 2))
)

const diff = (a, b) => {
  return a.filter(x => b.indexOf(x) === -1)
}

const environmentStats = () => {
  const normalGlobalKeys = Object.freeze([
    'Buffer',
    'clearImmediate',
    'clearInterval',
    'clearTimeout',
    'console',
    'DTRACE_HTTP_CLIENT_REQUEST',
    'DTRACE_HTTP_CLIENT_RESPONSE',
    'DTRACE_HTTP_SERVER_REQUEST',
    'DTRACE_HTTP_SERVER_RESPONSE',
    'DTRACE_NET_SERVER_CONNECTION',
    'DTRACE_NET_STREAM_END',
    'global',
    'module',
    'process',
    'require',
    'setImmediate',
    'setInterval',
    'setTimeout'
  ])

  console.log(
    'globals from truffle testsuite',
    diff(Object.keys(global), normalGlobalKeys)
  )
}

const getGasCostsForTx = async txHash => {
  const receipt = await web3.eth.getTransactionReceipt(txHash)
  return {
    gasUsed: receipt.gasUsed,
    cumulativeGasUsed: receipt.cumulativeGasUsed
  }
}

const cleanEventStreams = eventStreams => {
  Object.keys(eventStreams).forEach(key => {
    // stops watching for events, and closes filter connection
    eventStreams[key].stopWatching()
    // remove key so this object can be used many times in a test suite
    delete eventStreams[key]
  })
}

module.exports = {
  cleanEventStreams,
  diff,
  logWithLabel,
  logDataWithLabel,
  environmentStats,
  getGasCostsForTx
}
