// Helpful commands while in `yarn repl`

const weiUnit = 1e18
const fromWei = x => x.dividedBy(weiUnit)
const displayFromWei = x => fromWei(x).toString()

const traceWeb3 = label => (error, data) =>
  console.log('TRACE:', label, 'error', error, '\n', 'data', data)

const logBigNumber = x => x.toString()

const watchEvent = event =>
  event.watch((error, result) =>
    console.log('error', error, '\n', 'result', result)
  )
