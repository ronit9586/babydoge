/**
 * Use this file to configure your truffle project. It's seeded with some
 * common settings for different networks and features like migrations,
 * compilation and testing. Uncomment the ones you need or modify
 * them to suit your project as necessary.
 *
 * More information about configuration can be found at:
 *
 * trufflesuite.com/docs/advanced/configuration
 *
 * To deploy via Infura you'll need a wallet provider (like @truffle/hdwallet-provider)
 * to sign your transactions before they're sent to a remote public node. Infura accounts
 * are available for free at: infura.io/register.
 *
 * You'll also need a mnemonic - the twelve word phrase the wallet uses to generate
 * public/private key pairs. If you're publishing your code to GitHub make sure you load this
 * phrase from a file you've .gitignored so it doesn't accidentally become public.
 *
 */

// const HDWalletProvider = require('@truffle/hdwallet-provider');
//
const HDWalletProvider = require("@truffle/hdwallet-provider");
require("dotenv").config();
const mnemonic = process.env.MNEMONIC;
// const rinkebyInfuraKey = process.env.RINKEBYINFURAKEY;

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1", // Localhost (default: none)
      port: 7545, // Standard Ethereum port (default: none)
      network_id: "1337", // Any network (default: none)
    },
  //   kovan: {
  //     provider: () => new HDWalletProvider(mnemonic, `https://kovan.infura.io/v3/f7602f629b114e1294d3a0d676411708`),
  //     gas: 5000000,
  //     gasPrice: 25000000000,
  //     network_id: 42
  // },
  // ropsten: {
  //   provider: () => new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/f7602f629b114e1294d3a0d676411708"),
  //   network_id: 3,
  //   networkCheckTimeout: 10000,
  //   confirmations: 1,
  //   timeoutBlocks: 2000,
  //   gas: 8000000,
  //   skipDryRun: true, // Skip dry run before migrations? (default: false for public nets )
  //   // confirmations: 2,    // # of confs to wait between deployments. (default: 0)
  //   // timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
  //   // skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
  // },
  // rinkeby: {
  //   provider: () => new HDWalletProvider(mnemonic, rinkebyInfuraKey),
  //   network_id: 4,
  //   gas: 8000000,
  //   gasPrice: 240000000000,
  //   skipDryRun: true, // Skip dry run before migrations? (default: false for public nets )
  // },
  // mainnet: {
  //   provider: () => new HDWalletProvider(mnemonic, mainnetInfuraKey, 0),
  //   network_id: 1,
  //   gas: 8000000,
  //   gasPrice: 240000000000,
  //   timeoutBlocks: 5000000, // # of blocks before a deployment times out  (minimum/default: 50)
  //   skipDryRun: true, // Skip dry run before migrations? (default: false for public nets )
  // },
    testnet: {
      provider: () => new HDWalletProvider(mnemonic, `https://speedy-nodes-nyc.moralis.io/e8c00095108f1be80f03f8da/bsc/testnet`),
      network_id: 97,
      confirmations: 2,
      timeoutBlocks: 200000000,
      skipDryRun: true,
      networkCheckTimeout: 999999,
    },
    bsc: {
      provider: () => new HDWalletProvider(mnemonic, `https://bsc-dataseed1.binance.org`),
      network_id: 56,
      confirmations: 2,
      timeoutBlocks: 200000000,
      skipDryRun: true,
      networkCheckTimeout: 999999,
    },
  },
  //
  // Configure your compilers
  compilers: {
    solc: {
      version: "^0.8.10", // Fetch exact version from solc-bin (default: truffle's version)
        // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
        settings: {
        // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          enabled: false,
            runs: 200,
          },
        //  evmVersion: "byzantium"
      },
    },
  },

  plugins: ["truffle-plugin-verify"],
  api_keys: {
    etherscan: "", // Add  API key
    bscscan: "T4A58D6AI7PPUBT8IXP16PSQY9V67WJ41R",
  },
};
