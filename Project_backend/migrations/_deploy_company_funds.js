const CompanyFunds = artifacts.require("CompanyFunds");

module.exports = async function (deployer, network, accounts) {
  // Deploy the contract
  await deployer.deploy(CompanyFunds);

  const companyFundsInstance = await CompanyFunds.deployed();

  console.log(`CompanyFunds deployed at: ${companyFundsInstance.address}`);

  // Set the company admin to the first account
  await companyFundsInstance.setCompanyAdmin(accounts[0]);
  console.log(`Company admin set to: ${accounts[0]}`);

  // Set up a sample department admin (using Ganache accounts)
  await companyFundsInstance.setDepartmentAdmin(
    accounts[1],         // Department address
    accounts[2],         // Department admin
    "HR Department",     // Department name
    { from: accounts[0] }
  );

  console.log(`Department admin set at: ${accounts[2]}`);
};
