// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title SimpleBank - Foundational Blockchain Ledger Implementation
 * @notice Architectural contrast against traditional SQL database operations
 * 
 * COMPARISON WITH SQL DATABASE:
 * - In SQL: An `accounts (address VARCHAR PRIMARY KEY, balance DECIMAL)` table
 *   executes: `UPDATE accounts SET balance = balance + 100 WHERE address = '...'`
 * - In Solidity: State is stored in persistent contract storage `mapping(address => uint256)`.
 *   Transitions are executed deterministically by EVM nodes, consumed via Gas,
 *   and appended to immutable blocks verified across a P2P mesh network.
 */
contract SimpleBank {
    // -------------------------------------------------------------
    // 1. STATE VARIABLES (Persistent Blockchain Storage)
    // Equivalent to database table columns
    // -------------------------------------------------------------
    address public immutable owner;
    
    // Key-value mapping of account balances (similar to an indexed SQL table)
    mapping(address => uint256) private balances;

    // -------------------------------------------------------------
    // 2. EVENTS (Immutable Transaction Receipts & Logs)
    // Equivalent to append-only audit log tables in SQL
    // PROPERTIES: Blockchain events cannot be pruned, updated, or deleted.
    // -------------------------------------------------------------
    event Deposit(address indexed account, uint256 amount, uint256 timestamp);
    event Withdraw(address indexed account, uint256 amount, uint256 timestamp);
    event Transfer(address indexed from, address indexed to, uint256 amount, uint256 timestamp);

    // -------------------------------------------------------------
    // 3. CONSTRUCTOR (Executes once upon contract deployment)
    // Equivalent to database migration / init_db.sql scripts
    // -------------------------------------------------------------
    constructor() {
        owner = msg.sender;
    }

    // -------------------------------------------------------------
    // 4. TRANSACTION HANDLERS (STATE MUTATIONS)
    // -------------------------------------------------------------

    /**
     * @dev Deposit native ETH into the bank
     * 'payable' keyword enables accepting native currency.
     */
    function deposit() external payable {
        require(msg.value > 0, "Deposit amount must be greater than 0");

        balances[msg.sender] += msg.value;

        emit Deposit(msg.sender, msg.value, block.timestamp);
    }

    /**
     * @dev Withdraw funds from the bank
     * Checks-Effects-Interactions pattern protects against reentrancy.
     */
    function withdraw(uint256 amount) external {
        require(amount > 0, "Withdraw amount must be greater than 0");
        require(balances[msg.sender] >= amount, "Insufficient balance in bank");

        balances[msg.sender] -= amount;

        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "ETH transfer failed");

        emit Withdraw(msg.sender, amount, block.timestamp);
    }

    /**
     * @dev Internal account transfer
     * SQL TRANSACTION ANALOGY:
     * BEGIN TRANSACTION;
     *   UPDATE accounts SET balance = balance - amount WHERE address = from;
     *   UPDATE accounts SET balance = balance + amount WHERE address = to;
     * COMMIT;
     * If require() fails, entire state automatically REVERTS (like SQL ROLLBACK).
     */
    function transfer(address to, uint256 amount) external {
        require(to != address(0), "Cannot transfer to zero address");
        require(to != msg.sender, "Cannot transfer to yourself");
        require(amount > 0, "Transfer amount must be greater than 0");
        require(balances[msg.sender] >= amount, "Insufficient balance");

        balances[msg.sender] -= amount;
        balances[to] += amount;

        emit Transfer(msg.sender, to, amount, block.timestamp);
    }

    // -------------------------------------------------------------
    // 5. VIEW FUNCTIONS (Free read operations - zero gas from client)
    // Equivalent to: SELECT balance FROM accounts WHERE address = ...
    // -------------------------------------------------------------
    function getBalance(address account) external view returns (uint256) {
        return balances[account];
    }

    function getMyBalance() external view returns (uint256) {
        return balances[msg.sender];
    }

    function getContractTotalBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
