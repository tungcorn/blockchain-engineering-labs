// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title SimpleBank - Ví dụ cơ bản về Sổ cái Ngân hàng trên Blockchain
 * @notice Dành cho sinh viên năm 4 môn "Chuỗi khối và ứng dụng"
 * 
 * ĐỐI CHIẾU VỚI CƠ SỞ DỮ LIỆU SQL:
 * - Trong SQL: Bạn có bảng `accounts (address VARCHAR PRIMARY KEY, balance DECIMAL)`
 *   và thực hiện: `UPDATE accounts SET balance = balance + 100 WHERE address = '...'`
 * - Trong Solidity: Trạng thái được lưu trong biến state `mapping(address => uint256)`.
 *   Mỗi khi thay đổi, máy ảo Ethereum (EVM) thực thi giao dịch, tính phí Gas,
 *   và đóng gói vào một khối (Block) bất biến trong mạng P2P.
 */
contract SimpleBank {
    // -------------------------------------------------------------
    // 1. STATE VARIABLES (Lưu trữ trên Storage của Blockchain)
    // Tương đương: Cột dữ liệu trong Database Table
    // -------------------------------------------------------------
    address public immutable owner; // Địa chỉ người tạo hợp đồng (tương đương Admin/Owner)
    
    // Tương đương: Bảng khóa-giá trị (Key-Value) lưu số dư của từng địa chỉ ví
    mapping(address => uint256) private balances;

    // -------------------------------------------------------------
    // 2. EVENTS (Sự kiện ghi vào Transaction Receipt / Logs)
    // Tương đương: Bảng Audit Log / Transaction Log trong SQL
    // ĐẶC ĐIỂM: Event trong Blockchain được lưu vào sổ cái vĩnh viễn,
    // không thể bị ai (kể cả Admin) xóa hay UPDATE sửa đổi.
    // -------------------------------------------------------------
    event Deposit(address indexed account, uint256 amount, uint256 timestamp);
    event Withdraw(address indexed account, uint256 amount, uint256 timestamp);
    event Transfer(address indexed from, address indexed to, uint256 amount, uint256 timestamp);

    // -------------------------------------------------------------
    // 3. CONSTRUCTOR (Chạy duy nhất 1 lần khi Hợp đồng được Deploy lên Mạng)
    // Tương đương: File migration / init_db.sql khởi tạo hệ thống
    // -------------------------------------------------------------
    constructor() {
        owner = msg.sender; // msg.sender: Địa chỉ ví ký chữ ký số deploy contract
    }

    // -------------------------------------------------------------
    // 4. CÁC HÀM XỬ LÝ NGHIỆP VỤ (TRANSACTIONS)
    // -------------------------------------------------------------

    /**
     * @dev Nạp ETH vào ngân hàng
     * Từ khóa 'payable': Cho phép hàm nhận tiền mã hóa thực (Native token).
     * msg.value: Số lượng Wei gửi kèm giao dịch (1 ETH = 10^18 Wei).
     */
    function deposit() external payable {
        require(msg.value > 0, "Deposit amount must be greater than 0");

        balances[msg.sender] += msg.value;

        // Bắn ra sự kiện để Client (dApp frontend) hoặc các Node lắng nghe
        emit Deposit(msg.sender, msg.value, block.timestamp);
    }

    /**
     * @dev Rút tiền từ ngân hàng
     * Kiểm tra số dư trước, trừ tiền, rồi mới chuyển ETH đi (Checks-Effects-Interactions pattern).
     */
    function withdraw(uint256 amount) external {
        require(amount > 0, "Withdraw amount must be greater than 0");
        require(balances[msg.sender] >= amount, "Insufficient balance in bank");

        // Trừ số dư trong State
        balances[msg.sender] -= amount;

        // Chuyển Native ETH trả về ví người gọi
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "ETH transfer failed");

        emit Withdraw(msg.sender, amount, block.timestamp);
    }

    /**
     * @dev Chuyển tiền nội bộ giữa 2 tài khoản
     * ĐỐI CHIẾU SQL TRANSACTION:
     * BEGIN TRANSACTION;
     *   UPDATE accounts SET balance = balance - amount WHERE address = from;
     *   UPDATE accounts SET balance = balance + amount WHERE address = to;
     * COMMIT;
     * Nếu require() thất bại -> toàn bộ trạng thái tự động REVERT (như ROLLBACK trong SQL).
     */
    function transfer(address to, uint256 amount) external {
        require(to != address(0), "Cannot transfer to zero address");
        require(to != msg.sender, "Cannot transfer to yourself");
        require(amount > 0, "Transfer amount must be greater than 0");
        require(balances[msg.sender] >= amount, "Insufficient balance");

        // Cập nhật trạng thái
        balances[msg.sender] -= amount;
        balances[to] += amount;

        emit Transfer(msg.sender, to, amount, block.timestamp);
    }

    // -------------------------------------------------------------
    // 5. VIEW FUNCTIONS (Đọc dữ liệu - Không tốn Gas khi gọi từ Client)
    // Tương đương câu lệnh: SELECT balance FROM accounts WHERE address = ...
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
