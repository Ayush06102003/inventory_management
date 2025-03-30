module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,         // Ganache port
      network_id: "*",    // Match any network id
      gas: 6721975,       
      gasPrice: 20000000000,
    },
  },
  compilers: {
    solc: {
      version: "0.8.21",   // Match your contract version
    }
  }
};
