/**
 * SIMULATE.JS - MÔ PHỎNG ĐỐI CHIẾU SQL VS BLOCKCHAIN BẰNG NODE.JS
 * 
 * Chạy lệnh: node scripts/simulate.js
 * 
 * Mục đích:
 * 1. Cho bạn thấy sự khác biệt giữa "Mutable State" (SQL) và "Append-Only Hash Chain" (Blockchain).
 * 2. Chứng minh toán học tại sao sửa 1 byte trong quá khứ của Blockchain sẽ phá vỡ toàn bộ chuỗi.
 */

const crypto = require('crypto');

function sha256(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
}

console.log('='.repeat(70));
console.log(' PHẦN 1: MÔ PHỎNG HỆ THỐNG CƠ SỞ DỮ LIỆU TẬP TRUNG (SQL / RDBMS)');
console.log('='.repeat(70));

// Giả lập bảng accounts trong SQL
const sqlAccountsTable = {
    '0xAlice': 500,
    '0xBob': 200
};

console.log('Trạng thái ban đầu trong SQL:');
console.table(sqlAccountsTable);

// Giao dịch chuyển tiền trong SQL (In-place mutation)
console.log('\n-> Thực hiện UPDATE: Alice chuyển 100 cho Bob...');
sqlAccountsTable['0xAlice'] -= 100;
sqlAccountsTable['0xBob'] += 100;
console.log('Trạng thái sau giao dịch hợp lệ:');
console.table(sqlAccountsTable);

// Hacker hoặc DBA lén sửa số dư trong cơ sở dữ liệu
console.log('\n[!] Hacker hoặc Admin can thiệp vào máy chủ SQL:');
console.log('    Thực thi: UPDATE accounts SET balance = 999999 WHERE address = "0xAlice";');
sqlAccountsTable['0xAlice'] = 999999;
console.log('Trạng thái sau khi bị giả mạo:');
console.table(sqlAccountsTable);
console.log('=> KẾT LUẬN SQL: Dữ liệu bị sửa mà không có cơ chế toán học nội tại nào tự phát hiện!');


console.log('\n' + '='.repeat(70));
console.log(' PHẦN 2: MÔ PHỎNG CHUỖI KHỐI (BLOCKCHAIN & HASH CHAIN)');
console.log('='.repeat(70));

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data; // Dữ liệu giao dịch (vd: Alice -> Bob: 100)
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
        return new Block(0, '2026-01-01T00:00:00Z', { info: 'Genesis Block - Khối nguyên thủy' }, '0'.repeat(64));
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

            // 1. Kiểm tra mã băm của chính khối hiện tại có khớp với nội dung không
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return {
                    valid: false,
                    tamperedBlockIndex: i,
                    reason: `Nội dung khối #${i} đã bị thay đổi! Hash tính lại không khớp.`
                };
            }

            // 2. Kiểm tra liên kết mật mã tới khối trước
            if (currentBlock.previousHash !== previousBlock.hash) {
                return {
                    valid: false,
                    tamperedBlockIndex: i,
                    reason: `Mối liên kết chuỗi bị đứt gãy tại khối #${i}! previousHash không khớp với hash của khối #${i-1}.`
                };
            }
        }
        return { valid: true };
    }
}

const myChain = new MiniBlockchain();

console.log('Đang tạo và thêm các khối giao dịch vào Blockchain...');
myChain.addBlock({ from: '0xAlice', to: '0xBob', amount: 100, signature: '0x3a4b...' });
myChain.addBlock({ from: '0xBob', to: '0xCharlie', amount: 40, signature: '0x7c8d...' });

console.log('\nDanh sách các khối hiện tại trong sổ cái:');
myChain.chain.forEach(b => {
    console.log(`[Block #${b.index}]`);
    console.log(` - Data        : ${JSON.stringify(b.data)}`);
    console.log(` - PrevHash    : ${b.previousHash.slice(0, 16)}...`);
    console.log(` - Hash        : ${b.hash.slice(0, 16)}...`);
});

let check = myChain.verifyChainIntegrity();
console.log(`\n-> Kiểm tra tính toàn vẹn của chuỗi khối: ${check.valid ? 'HỢP LỆ (VALID) ✓' : 'BỊ LỖI ✗'}`);

console.log('\n[!] KỊCH BẢN TẤN CÔNG: Hacker cố tình sửa dữ liệu ở Khối #1 (tăng số tiền từ 100 lên 1000)');
myChain.chain[1].data.amount = 1000; // Sửa dữ liệu

console.log('-> Đang chạy kiểm tra mật mã toàn bộ các node trong mạng P2P:');
check = myChain.verifyChainIntegrity();

if (!check.valid) {
    console.log(`[CẢNH BÁO PHÁT HIỆN GIAN LẬN]`);
    console.log(`-> Kết quả: BẤT HỢP LỆ (INVALID) ✗`);
    console.log(`-> Lý do   : ${check.reason}`);
    console.log(`=> KẾT LUẬN: Mọi node khác trên mạng P2P sẽ lập tức từ chối khối rác này!`);
    console.log(`   Dữ liệu lịch sử trên Blockchain được bảo vệ tuyệt đối bằng mật mã học.`);
}
