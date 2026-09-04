-- =========================================================================
-- ARCHITECTURAL COMPARISON: RELATIONAL DATABASE (SQL) VS SOLIDITY BLOCKCHAIN
-- =========================================================================

-- 1. Accounts table (Corresponds to: mapping(address => uint256) balances in Solidity)
CREATE TABLE IF NOT EXISTS accounts (
    account_address VARCHAR(42) PRIMARY KEY, -- Wallet / account address (0x...)
    balance NUMERIC(38, 0) NOT NULL DEFAULT 0, -- Balance in Wei units
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Audit logs table (Corresponds to: event Transfer(...) in Solidity)
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    sender VARCHAR(42) NOT NULL,
    receiver VARCHAR(42) NOT NULL,
    amount NUMERIC(38, 0) NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    comment TEXT
);

-- 3. Document notary table (Corresponds to: mapping(bytes32 => DocumentRecord) in NotaryRegistry.sol)
CREATE TABLE IF NOT EXISTS document_notary (
    doc_hash CHAR(66) PRIMARY KEY, -- SHA-256 hash digest (0x...)
    notarized_by VARCHAR(42) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    metadata TEXT
);

-- -------------------------------------------------------------------------
-- ARCHITECTURAL ANALYSIS:
-- 1. IMMUTABILITY & AUDITABILITY:
--    - In SQL: An administrator / DBA superuser can execute:
--      UPDATE accounts SET balance = 999999999 WHERE account_address = '0xAdmin';
--      DELETE FROM audit_logs WHERE id = 5;
--      => Past historical records can be forged or deleted silently without warning!
--    - In Blockchain:
--      Entries are packaged into blocks linked cryptographically by prevHash.
--      Every state transition MUST be processed through smart contracts (transfer/deposit)
--      and validated by consensus quorum. Past transactions cannot be overwritten or deleted.
-- -------------------------------------------------------------------------
