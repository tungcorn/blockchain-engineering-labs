-- =========================================================================
-- ĐỐI CHIẾU HỆ THỐNG: CƠ SỞ DỮ LIỆU QUAN HỆ (SQL) VS BLOCKCHAIN SOLIDITY
-- Dành cho sinh viên năm 4 môn "Chuỗi khối và ứng dụng"
-- =========================================================================

-- 1. Bảng tài khoản (Tương đương: mapping(address => uint256) balances trong Solidity)
CREATE TABLE IF NOT EXISTS accounts (
    account_address VARCHAR(42) PRIMARY KEY, -- Địa chỉ ví (0x...)
    balance NUMERIC(38, 0) NOT NULL DEFAULT 0, -- Số dư đơn vị Wei
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Bảng nhật ký giao dịch (Tương đương: event Transfer(...) trong Solidity)
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    sender VARCHAR(42) NOT NULL,
    receiver VARCHAR(42) NOT NULL,
    amount NUMERIC(38, 0) NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    comment TEXT
);

-- 3. Bảng chứng thực tài liệu (Tương đương: mapping(bytes32 => DocumentRecord) trong NotaryRegistry.sol)
CREATE TABLE IF NOT EXISTS document_notary (
    doc_hash CHAR(66) PRIMARY KEY, -- Mã băm sha256 0x...
    notarized_by VARCHAR(42) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    metadata TEXT
);

-- -------------------------------------------------------------------------
-- PHÂN TÍCH ĐỐI CHIẾU:
-- 1. TÍNH BẤT BIẾN (IMMUTABILITY):
--    - Trong SQL: Một người có quyền Superuser / DBA có thể thực thi:
--      UPDATE accounts SET balance = 999999999 WHERE account_address = '0xAdmin';
--      DELETE FROM audit_logs WHERE id = 5;
--      => Dữ liệu quá khứ bị biến mất hoặc làm giả mà hệ thống không cảnh báo!
--    - Trong Blockchain:
--      Dữ liệu được băm (hash) thành khối, liên kết chặt chẽ bằng prevHash.
--      Mọi thay đổi số dư BẮT BUỘC phải đi qua Smart Contract (hàm transfer/deposit)
--      và được đóng gói vào một Block có chữ ký số. Không ai có thể DELETE hay UPDATE quá khứ.
-- -------------------------------------------------------------------------
