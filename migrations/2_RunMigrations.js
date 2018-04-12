const ForwardFactory = artifacts.require('./ForwardFactory.sol')
const SharedVault = artifacts.require('./SharedVault.sol')
const SimpleStorage = artifacts.require('./SimpleStorage.sol')
const TimedVault = artifacts.require('./TimedVault.sol')

module.exports = function(deployer) {
  deployer.deploy(ForwardFactory)
  deployer.deploy(SimpleStorage)

  // TODO: requires more complex setup
  // deployer.deploy(SharedVault)
  // deployer.deploy(TimedVault)
}
