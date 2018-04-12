const utils = require('./utils')

const ForwardFactory = artifacts.require('../contracts/ForwardFactory.sol')
const SimpleStorage = artifacts.require('../contracts/SimpleStorage.sol')

const eventStreams = {}

utils.environmentStats()

contract('ForwardFactory', accounts => {
  let templateContract
  let factoryContract

  before(async () =>
    Promise.all([SimpleStorage.new(), ForwardFactory.new()]).then(
      ([template, factory]) => {
        templateContract = template
        factoryContract = factory

        utils.logWithLabel(
          'Setup',
          `TemplateContract: ${templateContract.address}`,
          `FactoryContract: ${factoryContract.address}`
        )
      }
    )
  )

  beforeEach(() => {
    eventStreams.allTxs = web3.eth.filter({})

    eventStreams.ForwardFactoryTxs = web3.eth.filter({
      address: factoryContract.address
    })

    eventStreams.ForwardFactoryEvents = factoryContract.allEvents()

    eventStreams.TemplateContractEvents = templateContract.allEvents()
  })

  afterEach(async () => {
    const allTxs = await eventStreams.allTxs.get()
    utils.logDataWithLabel('All transactions', allTxs)

    const factoryTxs = await eventStreams.ForwardFactoryTxs.get()
    utils.logDataWithLabel('Transactions from ForwardFactory', factoryTxs)

    const gasCosts = await Promise.all(
      factoryTxs.map(async ({ transactionHash }) => {
        const gasCosts = await utils.getGasCostsForTx(transactionHash)
        return {
          txHash: transactionHash,
          gasCosts
        }
      })
    )
    utils.logDataWithLabel(
      'Gas Costs for ForwardFactory Transactions',
      gasCosts
    )

    const factoryEvents = await eventStreams.TemplateContractEvents.get()
    utils.logDataWithLabel('ForwardFactory events', factoryEvents)

    const templateEvents = await eventStreams.TemplateContractEvents.get()
    utils.logDataWithLabel('TemplateContract events', templateEvents)

    utils.cleanEventStreams(eventStreams)
  })

  it('should deploy a contract with same bytecode as template', async () => {
    // call to get the return value, what is the next address
    const deployedAddress = await factoryContract.deploy.call(
      templateContract.address
    )
    // deploy!
    await factoryContract.deploy(templateContract.address)

    // create a new instance
    deployedContract = await web3.eth
      .contract(SimpleStorage._json.abi)
      .at(deployedAddress)

    // check that the bytecode is the same
    assert.equal(deployedContract.bytecode, templateContract.bytecode)
    assert.equal(
      deployedContract.deployedBytecode,
      templateContract.deployedBytecode
    )
  })

  // it('should deploy a contract', async () => {
  //   const receipt = await factoryContract.deploy(templateContract.address)
  // })
})
