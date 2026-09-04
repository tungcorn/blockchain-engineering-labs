-- =========================================================================
-- QUERY & EXECUTION COMPARISON: SQL VS SOLIDITY
-- =========================================================================

-- -------------------------------------------------------------------------
-- SCENARIO 1: Transfer 100 units from Alice to Bob
-- -------------------------------------------------------------------------

-- [APPROACH 1: TRADITIONAL SQL (RDBMS)]
-- Network: Client opens direct TCP socket (Port 5432/3306) to 1 central database server.
-- ACID: Enforces Atomicity, Consistency, Isolation, Durability on 1 centralized instance / cluster.
BEGIN TRANSACTION;

-- Check and deduct Alice's balance
UPDATE accounts 
SET balance = balance - 100, 
    updated_at = CURRENT_TIMESTAMP
WHERE account_address = '0xAlice' AND balance >= 100;

-- Credit Bob's balance
UPDATE accounts 
SET balance = balance + 100, 
    updated_at = CURRENT_TIMESTAMP
WHERE account_address = '0xBob';

-- Record audit log
INSERT INTO audit_logs (sender, receiver, amount, comment)
VALUES ('0xAlice', '0xBob', 100, 'Direct transfer payment');

COMMIT;

-- => SECURITY & ARCHITECTURAL VULNERABILITIES:
-- 1. Single Point of Failure (SPOF): If the central database crashes, all client applications halt.
-- 2. Trust Model: Centralized admin trust required. A DBA can silently run:
--    UPDATE accounts SET balance = 500 WHERE account_address = '0xAlice'; -- Zero cryptographic audit!


-- -------------------------------------------------------------------------
-- [APPROACH 2: DECENTRALIZED BLOCKCHAIN / SOLIDITY]
-- -------------------------------------------------------------------------
/*
// Network: Client signs transaction using private key -> Broadcasts to P2P mesh (Gossip Protocol).
// Thousands of validator nodes verify signatures, enter mempool, reach consensus, and append to block.

function transfer(address to, uint256 amount) external {
    // 1. Guard check (similar to SQL WHERE balance >= 100)
    require(balances[msg.sender] >= amount, "Insufficient balance");

    // 2. State transition
    balances[msg.sender] -= amount;
    balances[to] += amount;

    // 3. Emit immutable event log (equivalent to audit_logs, but cryptographically sealed)
    emit Transfer(msg.sender, to, amount, block.timestamp);
}

=> BLOCKCHAIN STRENGTHS:
1. Byzantine Fault Tolerance (BFT): Decentralized mesh survives even when hundreds of nodes fail.
2. Trustless: Nobody can alter balances without valid ECDSA private key digital signatures.
3. Immutability: Every transaction is cryptographically chained via SHA-256 hashes.

=> TRADE-OFFS:
- SQL Performance: 10,000 - 100,000 queries/sec (TPS), < 1ms latency.
- Blockchain Performance: Ethereum ~15-30 TPS, ~12s block times (requires network-wide consensus).
*/
