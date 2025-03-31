module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,         // Ganache port
      network_id: "5777",    // Match any network id
      gas: 8000000,       
      gasPrice: 2000000000000,
    },
  },
  compilers: {
    solc: {
      version: "0.8.21",   // Match your contract version
    }
  }
};
