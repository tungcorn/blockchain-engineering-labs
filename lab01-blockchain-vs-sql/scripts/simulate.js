/**
 * SIMULATE.JS - SQL VS BLOCKCHAIN CRYPTOGRAPHIC SIMULATION IN NODE.JS
 * 
 * Run command: node scripts/simulate.js
 * 
 * Purpose:
 * 1. Demonstrate the contrast between "Mutable In-Place State" (SQL) and "Append-Only Hash Chaining" (Blockchain).
 * 2. Mathematically demonstrate why mutating 1 byte in past blockchain history breaks downstream integrity.
 */

const crypto = require('crypto');

function sha256(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
}

console.log('='.repeat(70));
console.log(' PART 1: CENTRALIZED DATABASE (SQL / RDBMS) MUTATION SIMULATION');
console.log('='.repeat(70));

// Simulated accounts table in SQL
const sqlAccountsTable = {
    '0xAlice': 500,
    '0xBob': 200
};

console.log('Initial SQL database state:');
console.table(sqlAccountsTable);

// Transaction transfer in SQL (In-place mutation)
console.log('\n-> Executing UPDATE: Alice transfers 100 to Bob...');
sqlAccountsTable['0xAlice'] -= 100;
sqlAccountsTable['0xBob'] += 100;
console.log('State after authorized transaction:');
console.table(sqlAccountsTable);

// Silent administrator / DBA tamper
console.log('\n[!] Malicious DBA / Unauthorized admin memory overwrite:');
console.log('    Executing: UPDATE accounts SET balance = 999999 WHERE address = "0xAlice";');
sqlAccountsTable['0xAlice'] = 999999;
console.log('State after silent tamper:');
console.table(sqlAccountsTable);
console.log('=> SQL FINDING: Data was mutated in-place with zero intrinsic cryptographic anomaly detection!');


console.log('\n' + '='.repeat(70));
console.log(' PART 2: DECENTRALIZED BLOCKCHAIN CRYPTOGRAPHIC HASH CHAINING');
console.log('='.repeat(70));

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data; // Transaction payload
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        const payload = `${this.index}|${this.timestamp}|${JSON.stringify(this.data)}|${this.previousHash}`;
        return sha256(payload);
    }
}

class MiniBlockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock() {
        return new Block(0, '2026-01-01T00:00:00Z', { info: 'Genesis Block' }, '0'.repeat(64));
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(data) {
        const newBlock = new Block(
            this.chain.length,
            new Date().toISOString(),
            data,
            this.getLatestBlock().hash
        );
        this.chain.push(newBlock);
        return newBlock;
    }

    verifyChainIntegrity() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            // 1. Verify current block's hash matches its computed payload
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return {
                    valid: false,
                    tamperedBlockIndex: i,
                    reason: `Block #${i} content altered! Recomputed hash mismatch (Avalanche Effect).`
                };
            }

            // 2. Verify cryptographic linkage to the preceding block
            if (currentBlock.previousHash !== previousBlock.hash) {
                return {
                    valid: false,
                    tamperedBlockIndex: i,
                    reason: `Broken chain link at Block #${i}! previousHash does not match hash of Block #${i-1}.`
                };
            }
        }
        return { valid: true };
    }
}

const myChain = new MiniBlockchain();

console.log('Appending transaction blocks to the blockchain ledger...');
myChain.addBlock({ from: '0xAlice', to: '0xBob', amount: 100, signature: '0x3a4b...' });
myChain.addBlock({ from: '0xBob', to: '0xCharlie', amount: 40, signature: '0x7c8d...' });

console.log('\nCurrent blocks recorded in distributed ledger:');
myChain.chain.forEach(b => {
    console.log(`[Block #${b.index}]`);
    console.log(` - Data        : ${JSON.stringify(b.data)}`);
    console.log(` - PrevHash    : ${b.previousHash.slice(0, 16)}...`);
    console.log(` - Hash        : ${b.hash.slice(0, 16)}...`);
});

let check = myChain.verifyChainIntegrity();
console.log(`\n-> Verifying ledger cryptographic integrity: ${check.valid ? 'VALID ✓' : 'BROKEN ✗'}`);

console.log('\n[!] ATTACK SCENARIO: Malicious node tampers Block #1 data (altering amount 100 -> 1000)');
myChain.chain[1].data.amount = 1000;

console.log('-> Running P2P consensus cryptographic verification across network peers:');
check = myChain.verifyChainIntegrity();

if (!check.valid) {
    console.log(`[ALERT: CRYPTOGRAPHIC TAMPER DETECTED]`);
    console.log(`-> Verification Result: INVALID ✗`);
    console.log(`-> Cause               : ${check.reason}`);
    console.log(`=> BLOCKCHAIN FINDING: All independent P2P nodes immediately REJECT the forged chain!`);
    console.log(`   Past ledger entries remain mathematically immutable.`);
}
