// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract CompanyFunds {
    struct Department {
        address[] admins;
        uint256 balance;
        uint256[] requestsLists;
        string departmentName;
        mapping(uint256 => bool) requests;
    }

    address public companyAccount;
    address[] public companyAdmins;
    mapping(string => Department) public departments;  // Use department names as keys
    string[] public allDepartments;

    // Reentrancy guard
    bool private locked;

    constructor() {
        companyAccount = msg.sender;
        companyAdmins.push(msg.sender);
        locked = false;  // Initialize the reentrancy lock
    }

    modifier onlyCompanyAdmin() {
        require(isCompanyAdmin(msg.sender), "Only company admin is allowed");
        _;
    }

    modifier onlyDepartmentAdmin(string memory departmentName) {
        require(
            isDepartmentAdmin(departmentName, msg.sender),
            "Only department admin is allowed"
        );
        _;
    }

    modifier noReentrancy() {
        require(!locked, "Reentrancy detected");
        locked = true;
        _;
        locked = false;
    }

    // 💡 Events for better transparency
    event DepartmentCreated(string departmentName, address admin);
    event FundsRequested(string departmentName, uint256 amount);
    event FundsApproved(string departmentName, uint256 amount);
    event FundsWithdrawn(string departmentName, address recipient, uint256 amount);
    event CompanyAdminAdded(address admin);

    // ✅ Fallback and Receive functions
    receive() external payable {
        emit FundsApproved("ETH Transfer", msg.value);
    }

    fallback() external payable {
        emit FundsApproved("ETH Transfer", msg.value);
    }

    function isCompanyAdmin(address _admin) public view returns (bool) {
        for (uint256 i = 0; i < companyAdmins.length; i++) {
            if (companyAdmins[i] == _admin) {
                return true;
            }
        }
        return false;
    }

    function isDepartmentAdmin(string memory departmentName, address _admin) public view returns (bool) {
        Department storage dept = departments[departmentName];
        for (uint256 i = 0; i < dept.admins.length; i++) {
            if (dept.admins[i] == _admin) {
                return true;
            }
        }
        return false;
    }

    function setCompanyAdmin(address _admin) external {
        require(
            msg.sender == companyAccount,
            "Only company account can set admins"
        );
        companyAdmins.push(_admin);
        emit CompanyAdminAdded(_admin);
    }

    function createDepartment(
        string memory _departmentName,
        address _admin
    ) external onlyCompanyAdmin {
        require(bytes(departments[_departmentName].departmentName).length == 0, "Department already exists");

        Department storage newDept = departments[_departmentName];
        newDept.admins.push(_admin);
        newDept.departmentName = _departmentName;

        allDepartments.push(_departmentName);
        
        emit DepartmentCreated(_departmentName, _admin);
    }

    function requestFunds(string memory departmentName, uint256 _amount) external {
        require(_amount > 0, "Amount must be greater than 0");
        
        Department storage dept = departments[departmentName];
        
        dept.requestsLists.push(_amount);
        dept.requests[_amount] = true;

        emit FundsRequested(departmentName, _amount);
    }

    function approveFunds(string memory departmentName) external payable onlyCompanyAdmin {
        require(msg.value > 0, "Must send funds");

        Department storage dept = departments[departmentName];
        dept.balance += msg.value;
        dept.requests[msg.value] = false;

        emit FundsApproved(departmentName, msg.value);
    }

    function withdraw(string memory departmentName, uint256 _amount) external onlyDepartmentAdmin(departmentName) noReentrancy {
        require(_amount > 0, "Amount must be greater than 0");

        Department storage dept = departments[departmentName];
        require(dept.balance >= _amount, "Insufficient balance");

        // ✅ Transfer first to prevent reentrancy
        payable(msg.sender).transfer(_amount);
        dept.balance -= _amount;

        emit FundsWithdrawn(departmentName, msg.sender, _amount);
    }

    function getCompanyBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function getDepartmentBalance(string memory departmentName) external view returns (uint256) {
        return departments[departmentName].balance;
    }

    function getCompanyAdmins() external view returns (address[] memory) {
        return companyAdmins;
    }

    function getAllDepartments() external view returns (string[] memory) {
        return allDepartments;
    }

    function getDepartmentData(string memory departmentName)
        external
        view
        returns (
            address[] memory,
            uint256,
            string memory,
            uint256[] memory
        )
    {
        Department storage department = departments[departmentName];
        return (
            department.admins,
            department.balance,
            department.departmentName,
            department.requestsLists
        );
    }

    function requestStatus(string memory departmentName, uint256 _amount) external view returns (bool) {
        return departments[departmentName].requests[_amount];
    }
}
