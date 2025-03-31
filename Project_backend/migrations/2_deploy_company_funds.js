const CompanyFunds = artifacts.require("CompanyFunds");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(CompanyFunds);

  const companyFundsInstance = await CompanyFunds.deployed();
  console.log(`CompanyFunds deployed at: ${companyFundsInstance.address}`);

  // Create Departments
  await companyFundsInstance.createDepartment("HR", accounts[1]);
  console.log(`HR Department created with admin: ${accounts[1]}`);

  await companyFundsInstance.createDepartment("Finance", accounts[2]);
  console.log(`Finance Department created with admin: ${accounts[2]}`);

  await companyFundsInstance.createDepartment("IT", accounts[3]);
  console.log(`IT Department created with admin: ${accounts[3]}`);
};
