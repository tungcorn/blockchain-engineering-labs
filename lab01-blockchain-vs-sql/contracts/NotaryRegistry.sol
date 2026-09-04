// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title NotaryRegistry - Cryptographic Proof of Existence & Timestamping
 * @notice Demonstrates document integrity notarization without centralized third parties
 * 
 * CENTRALIZED SQL DATABASE PROBLEM:
 * - When storing document hashes in centralized databases (PostgreSQL/MySQL),
 *   a privileged superuser (DBA) or an attacker can execute:
 *   `UPDATE documents SET file_hash = '...' WHERE id = 1;`
 *   silently forging historical document records.
 * 
 * DECENTRALIZED BLOCKCHAIN SOLUTION:
 * - Stores immutable `bytes32 docHash` directly in contract state.
 * - Bound permanently to `block.timestamp` and cryptographic signature `msg.sender`.
 * - Tamper-proof: Preceding blocks cannot be modified without invalidating downstream hashes.
 */
contract NotaryRegistry {
    struct DocumentRecord {
        bytes32 docHash;       // SHA-256 or Keccak-256 digest (32 bytes)
        address notarizedBy;   // Registrant wallet address
        uint256 timestamp;     // Block timestamp when mined
        string metadata;       // Descriptive document identifier or title
    }

    // Mapping from document hash to notarization record
    mapping(bytes32 => DocumentRecord) public records;

    // Emitted when a document hash is notarized
    event DocumentNotarized(
        bytes32 indexed docHash,
        address indexed notarizedBy,
        uint256 timestamp,
        string metadata
    );

    /**
     * @dev Notarize a new document hash
     * @param _docHash 32-byte cryptographic hash of document payload
     * @param _metadata Metadata label or identifier
     */
    function notarize(bytes32 _docHash, string calldata _metadata) external {
        require(_docHash != bytes32(0), "Invalid document hash");
        require(records[_docHash].timestamp == 0, "Document hash already notarized on-chain!");

        records[_docHash] = DocumentRecord({
            docHash: _docHash,
            notarizedBy: msg.sender,
            timestamp: block.timestamp,
            metadata: _metadata
        });

        emit DocumentNotarized(_docHash, msg.sender, block.timestamp, _metadata);
    }

    /**
     * @dev Verify whether a document hash has been notarized and retrieve its record
     */
    function verify(bytes32 _docHash) external view returns (
        bool exists,
        address notarizedBy,
        uint256 timestamp,
        string memory metadata
    ) {
        DocumentRecord memory rec = records[_docHash];
        if (rec.timestamp == 0) {
            return (false, address(0), 0, "");
        }
        return (true, rec.notarizedBy, rec.timestamp, rec.metadata);
    }
}
