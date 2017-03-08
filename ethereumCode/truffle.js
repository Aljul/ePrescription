require("dotenv").config({path: './../.env'});

const bip39             = require("bip39");
const hdkey             = require('ethereumjs-wallet/hdkey');
const ethWallet         = require('ethereumjs-wallet');
const ProviderEngine    = require("web3-provider-engine");
const WalletSubprovider = require('web3-provider-engine/subproviders/wallet.js');
const Web3Subprovider   = require("web3-provider-engine/subproviders/web3.js");
const Web3              = require("web3");

var mnemonic = process.env.MNEMONIC
var hdwallet = hdkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic));

// Get the first account using the standard hd path.
var wallet_hdpath = "m/44'/60'/0'/0/";
var wallet = hdwallet.derivePath(wallet_hdpath + "0").getWallet();
var address = "0x" + wallet.getAddress().toString("hex");
// console.log(wallet.getOwnPropertyNames(o: Object)vateKey().toString("hex"))
console.log(address)

var providerUrl = `http://lhl3a6m5u.eastus.cloudapp.azure.com:8545`;
// var providerUrl = `https://ropsten.infura.io/${process.env.INFURA_ACCESS_TOKEN}`;
var engine = new ProviderEngine();
engine.addProvider(new WalletSubprovider(wallet, {}));
engine.addProvider(new Web3Subprovider(new Web3.providers.HttpProvider(providerUrl)));
// console.log(engine)
engine.on('block', function(block){
  console.log('================================')
  console.log('BLOCK CHANGED:', '#'+block.number.toString('hex'), '0x'+block.hash.toString('hex'))
  console.log('================================')
})

engine.on('error', function(err){
  // report connectivity errors
  console.error(err.stack)
})

engine.start(); // Required by the provider engine.


module.exports = {
  networks: {
    development: {
     host: "localhost",
     port: 8545,
     network_id: "*" // Match any network id
    },
    ropsten: {
    network_id: 3,    // Official ropsten network id
    provider: engine, // Use our custom provider
    from: address,     // Use the address we derived
    },
    private: {
      host: "localhost",
      port: 4000,
      network_id: "*"
    },
    azure: {
      network_id: "*",
      provider: engine,
      from: address
    }
  }
}
