# Blockchain vs SQL • Architecture & Visual Simulation

An interactive visual comparison between **Centralized Client-Server Databases (SQL)** and **Decentralized Peer-to-Peer Blockchains (Solidity)**.

---

## ⚡ Quick Start

### 1. Web Visualizer (Recommended)
Mở file [index.html](demo/index.html) trực tiếp trên bất kỳ trình duyệt nào (Chrome, Edge, Firefox) hoặc chạy:
```bash
npx serve demo
```

### 2. CLI Simulation
Mô phỏng tính toán mã băm SHA-256 và kiểm tra tính toàn vẹn dữ liệu qua dòng lệnh:
```bash
node scripts/simulate.js
```

---

## ⚖️ So Sánh Cốt Lõi (Core Comparison)

| Tiêu chí | Cơ sở dữ liệu SQL (RDBMS) | Chuỗi khối (Blockchain / Solidity) |
| :--- | :--- | :--- |
| **Kiến trúc mạng** | **Client - Server (Hình sao - Star)**: Các client gửi trực tiếp kết nối TCP tới 1 máy chủ DB. | **Peer-to-Peer Mesh (Ngang hàng)**: Các node liên kết mạng lưới, phát tán tin qua Gossip Protocol. |
| **Độ tin cậy mạng** | **SPOF (Single Point of Failure)**: Máy chủ trung tâm sập ➜ Toàn bộ hệ thống ngừng hoạt động. | **BFT (Byzantine Fault Tolerance)**: Nhiều node rớt mạng ➜ Hệ thống vẫn tự định tuyến và đồng thuận. |
| **Quyền quản trị** | **Tập trung (Centralized)**: Quản trị viên (DBA) có toàn quyền chạy `UPDATE`, `DELETE` sửa lịch sử. | **Phi tập trung (Trustless)**: Code is Law. Giao dịch ký bởi Private Key (ECDSA), không ai tự ý sửa được. |
| **Mô hình dữ liệu** | **CRUD (Mutable)**: Ghi đè trực tiếp lên ô nhớ hiện tại của bản ghi. | **Append-only (Immutable)**: Chỉ thêm mới khối, xâu chuỗi bằng hàm băm mật mã SHA-256. |
| **Độ trễ & Hiệu năng** | Cực nhanh (< 1ms, 10,000+ TPS). | Đánh đổi: Chậm hơn (~1-2s chờ mạng đồng thuận), đổi lấy sự minh bạch và bất biến tuyệt đối. |

---

## 📂 Cấu Trúc Dự Án

```text
├── demo/                       # Ứng dụng Web trực quan hóa so sánh song song (HTML/CSS/JS)
├── contracts/                  # Hợp đồng thông minh Solidity mẫu (SimpleBank, NotaryRegistry)
├── sql/                        # Schema và truy vấn SQL đối chiếu
├── scripts/                    # Script mô phỏng mật mã học (simulate.js)
└── README.md                   # Tài liệu dự án
```
