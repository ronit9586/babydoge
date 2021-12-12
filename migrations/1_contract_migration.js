const Token = artifacts.require("Token.sol");

var Web3 = require('Web3');
let totalSupply = 15e18;
let cap = 20e18;
module.exports = async function (deployer) {
  deployer.deploy(Token);
};