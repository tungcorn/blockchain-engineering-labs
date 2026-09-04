-- =========================================================================
-- SO SÁNH TRUY VẤN VÀ CƠ CHẾ THỰC THI: SQL VS SOLIDITY
-- =========================================================================

-- -------------------------------------------------------------------------
-- TÌNH HUỐNG 1: Chuyển tiền từ Alice sang Bob (100 đơn vị)
-- -------------------------------------------------------------------------

-- [CÁCH 1: TRONG SQL (RDBMS TRUYỀN THỐNG)]
-- Mạng: Client gửi gói tin TCP (Port 5432/3306) trực tiếp đến 1 máy chủ DB trung tâm.
-- ACID: Đảm bảo Atomicity, Consistency, Isolation, Durability trên 1 máy chủ hoặc cluster tập trung.
BEGIN TRANSACTION;

-- Kiểm tra và trừ tiền Alice
UPDATE accounts 
SET balance = balance - 100, 
    updated_at = CURRENT_TIMESTAMP
WHERE account_address = '0xAlice' AND balance >= 100;

-- Cộng tiền cho Bob
UPDATE accounts 
SET balance = balance + 100, 
    updated_at = CURRENT_TIMESTAMP
WHERE account_address = '0xBob';

-- Ghi nhật ký kiểm toán
INSERT INTO audit_logs (sender, receiver, amount, comment)
VALUES ('0xAlice', '0xBob', 100, 'Chuyen tien hoc phi');

COMMIT;

-- => ĐIỂM YẾU VỀ MẶT BẢO MẬT & MẠNG:
-- 1. Single Point of Failure (SPOF): Nếu Server DB sập hoặc cáp mạng tới Server bị đứt, toàn bộ dịch vụ ngưng hoạt động.
-- 2. Trust Model: Bắt buộc phải tin tưởng người quản trị hệ thống (DBA). DBA có thể âm thầm chạy:
--    UPDATE accounts SET balance = 500 WHERE account_address = '0xAlice'; -- Không ai biết!


-- -------------------------------------------------------------------------
-- [CÁCH 2: TRONG BLOCKCHAIN / SOLIDITY]
-- -------------------------------------------------------------------------
/*
// Mạng: Client ký giao dịch bằng Private Key -> Broadcast vào mạng P2P (Gossip Protocol)
// Hàng nghìn node nhận, đưa vào Mempool -> Miner/Validator gom lại đào Block -> Consensus đạt được.

function transfer(address to, uint256 amount) external {
    // 1. Kiểm tra điều kiện (tương tự WHERE balance >= 100)
    require(balances[msg.sender] >= amount, "Insufficient balance");

    // 2. Thay đổi trạng thái (State Transition)
    balances[msg.sender] -= amount;
    balances[to] += amount;

    // 3. Bắn sự kiện (Tương đương INSERT INTO audit_logs, nhưng BẤT BIẾN)
    emit Transfer(msg.sender, to, amount, block.timestamp);
}

=> ĐIỂM MẠNH:
1. Không có điểm lỗi đơn lẻ: Mạng P2P có hàng ngàn node, 100 node sập mạng vẫn hoạt động bình thường.
2. Không cần tin tưởng ai (Trustless): Không ai có thể tự sửa số dư nếu không có chữ ký số (Private Key).
3. Bất biến (Immutability): Mọi giao dịch được xâu chuỗi bằng mật mã (Cryptographic Hash).

=> ĐIỂM ĐỔI LẠI (TRADE-OFF):
- Tốc độ SQL: 10,000 - 100,000 queries/giây (TPS), độ trễ < 5 mili-giây.
- Tốc độ Blockchain: Ethereum ~15-30 TPS, độ trễ 12 giây/khối (phải chờ đồng thuận P2P). Chi phí Gas cao.
*/
