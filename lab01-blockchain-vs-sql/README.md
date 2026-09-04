# Lab 01: Chuỗi Khối (Solidity) vs Cơ Sở Dữ Liệu Quan Hệ (SQL) & Mạng Máy Tính

> **Môn học**: Chuỗi khối và ứng dụng (Blockchain & Applications)  
> **Đối tượng**: Sinh viên năm 4 ngành CNTT / Khoa học máy tính / Mạng máy tính  
> **Dự án**: `d:\Hoc\BlockChain\lab01-blockchain-vs-sql`

---

## 📌 1. Bối cảnh và Mục tiêu Môn học

Giảng viên môn Chuỗi khối thường yêu cầu sinh viên **đối chiếu Blockchain với Cơ sở dữ liệu quan hệ (SQL) và Mạng máy tính**, bởi vì:
- Cả hai đều có chung một mục tiêu: **Lưu trữ, cập nhật trạng thái và truy vấn dữ liệu (State Management)**.
- Nhưng phương pháp thực hiện thì hoàn toàn đối lập nhau:
  1. **SQL (RDBMS)**: Mô hình mạng **Client - Server tập trung**, dữ liệu có thể **ghi đè tại chỗ (In-place Mutation / UPDATE)**, hoàn toàn phụ thuộc vào quyền lực của Quản trị viên (DBA).
  2. **Blockchain (Solidity)**: Mô hình mạng **Ngang hàng (Peer-to-Peer Mesh)** dùng giao thức lan truyền **Gossip Protocol**, dữ liệu **chỉ thêm mới (Append-only)**, các khối xâu chuỗi bằng mã băm mật mã học (`prevHash` -> `hash`), tính toàn vẹn được bảo vệ bởi sự đồng thuận phi tập trung (Consensus: PoW/PoS).

---

## 📂 2. Cấu trúc Thư mục Dự án

```text
lab01-blockchain-vs-sql/
├── contracts/                  # Mã nguồn Hợp đồng thông minh (Smart Contract)
│   ├── SimpleBank.sol          # Contract ngân hàng cơ bản: nạp, rút, chuyển khoản, Event
│   └── NotaryRegistry.sol      # Contract công chứng tài liệu (Proof of Existence) qua SHA-256
├── sql/                        # Mã nguồn SQL đối chiếu trực tiếp
│   ├── schema.sql              # Bảng accounts, audit_logs và phân tích bất biến
│   └── comparison_queries.sql  # So sánh truy vấn UPDATE với hàm Solidity transfer()
├── scripts/                    # Scripts mô phỏng logic
│   ├── simulate.js             # Mô phỏng tính toán hash và phát hiện tấn công gian lận
│   └── package.json            # Cấu hình dự án Node.js
├── demo/                       # Ứng dụng Web mô phỏng trực quan song song (theo ảnh mẫu)
│   ├── index.html              # Dashboard Split Screen giao diện Dark Cyberpunk
│   ├── style.css               # Thiết kế neon Cyan vs Amber chuẩn thẩm mỹ
│   └── app.js                  # Canvas vẽ gói tin TCP vs P2P Gossip, mô phỏng chuỗi khối
└── README.md                   # Hướng dẫn chi tiết
```

---

## 🚀 3. Hướng dẫn Chạy Thử nghiệm

### Cách 1: Chạy mô phỏng Console (Node.js)
Mở terminal tại thư mục này và chạy:
```bash
node scripts/simulate.js
```
**Bạn sẽ thấy:**
1. SQL cho phép DBA hoặc Hacker chạy lệnh `UPDATE accounts SET balance = 999999` mà không hề có cơ chế toán học nào tự phát hiện.
2. Blockchain tính toán mã băm SHA-256 qua các Block. Khi hacker cố tình sửa dữ liệu Khối #1, toàn bộ các khối sau bị đứt liên kết (`previousHash != hash`), mạng lưới lập tức từ chối và báo động `TAMPER DETECTED!`!

### Cách 2: Trải nghiệm Giao diện Trực quan Web Demo (Phong cách Dark Neon)
Chỉ cần mở file [index.html](file:///d:/Hoc/BlockChain/lab01-blockchain-vs-sql/demo/index.html) trực tiếp bằng trình duyệt (Chrome, Edge, Firefox) hoặc chạy:
```bash
npx serve demo
```
**Các tính năng tương tác trên Web Demo:**
- **Cột Trái (SQL - Màu Cyan)**:
  - Xem mô hình mạng hình sao (Star Topology) gửi gói tin TCP đến máy chủ trung tâm.
  - Bấm `▶ Thực Hiện UPDATE` để thấy việc ghi đè số dư tức thì trong bảng.
  - Bấm `⚠️ DBA Sửa Trộm` để thấy Admin có thể lén đổi số dư mà hệ thống không hề báo lỗi mật mã.
  - Bấm `🔌 Sập Server (SPOF)` để mô phỏng máy chủ trung tâm bị sập: Mọi kết nối bị lỗi `ECONNREFUSED` (Minh họa trực quan Single Point of Failure trong Mạng máy tính).
- **Cột Phải (Solidity Blockchain - Màu Amber)**:
  - Xem mạng P2P Mesh phát sóng giao dịch theo các vòng sóng **Gossip Protocol**.
  - Bấm `⚡ Phát Sóng P2P` để tạo giao dịch mới, tính mã băm SHA-256 thật và gắn thêm 1 khối vào chuỗi.
  - Bấm `💥 Tấn Công Sửa Khối` để giả lập hacker sửa khối cũ: Toàn bộ chuỗi khối lập tức chuyển sang **Màu đỏ neon (Đứt gãy liên kết)** và các node từ chối!
  - Bấm `📶 Tắt 2 Node (BFT)` để mô phỏng 2 peer bị rớt mạng: Giao thức Gossip vẫn tự định tuyến qua các node sống sót và đạt đồng thuận (Minh họa Byzantine Fault Tolerance).
- **Mổ xẻ Mật mã & Mạng máy tính chuyên sâu**:
  - Bấm `📦 Wireshark Sniffer` (Góc trên): Đối chiếu cấu trúc gói tin TCP Port 5432 (Plaintext SQL) vs DevP2P Frame Port 30303 (Ký số ECDSA secp256k1).
  - Bấm vào bất kỳ Block nào: Mở **Cryptographic Inspector Modal** để gõ sửa dữ liệu và chứng kiến hiệu ứng thác đổ (Avalanche Effect) của SHA-256 theo thời gian thực.
  - Bấm `⚡ Bắt Đầu Chạy Đua`: Đo đạc độ trễ giữa SQL (0.8ms) và Blockchain (1,420ms).

---

## 🎓 4. Bảng So sánh Cốt lõi dành cho Sinh viên năm 4 (Ôn thi)

| Tiêu chí so sánh | Cơ sở dữ liệu SQL (RDBMS) | Sổ cái Chuỗi khối (Solidity Blockchain) |
| :--- | :--- | :--- |
| **Kiến trúc Mạng** | Client - Server (Hình sao - Star Topology). | Ngang hàng (P2P Mesh Topology). Lan truyền tin đồn (Gossip Protocol). |
| **Điểm lỗi hệ thống** | **Single Point of Failure (SPOF)**: Máy chủ trung tâm sập thì toàn bộ hệ thống ngừng hoạt động. | **Chịu lỗi cao (Byzantine Fault Tolerance)**: 100 node sập mạng vẫn hoạt động bình thường. |
| **Mô hình Quản trị** | **Tập trung (Centralized)**: DBA / Quản trị viên nắm quyền sinh sát, có thể sửa bất kỳ dữ liệu nào. | **Phi tập trung (Trustless)**: Code is Law. Không ai có thể tự sửa trạng thái nếu không có Private Key ký số. |
| **Cơ chế Lưu trữ** | **CRUD (Mutable)**: Ghi đè trực tiếp lên ô nhớ hiện tại của bản ghi. | **Append-only (Immutable)**: Chỉ thêm mới khối. Liên kết bảo vệ bởi hàm băm mật mã (SHA-256 / Keccak-256). |
| **Hiệu năng (TPS)** | Rất cao: 10,000 – 100,000+ giao dịch/giây, độ trễ < 5ms. | Thấp hơn: 15 – 3,000 TPS, độ trễ từ vài giây đến vài phút do phải chờ các node P2P đạt đồng thuận. |
| **Phí thực thi** | Miễn phí trong nội bộ hoặc tính theo chi phí máy chủ hàng tháng. | Mỗi giao dịch thay đổi trạng thái phải trả phí **Gas** cho thợ đào/validator. |
| **Trường hợp áp dụng** | Ứng dụng nội bộ doanh nghiệp, yêu cầu tốc độ cao, độ trễ thấp (ERP, E-commerce, MXH). | Hệ thống liên ngân hàng, tài chính phi tập trung (DeFi), truy xuất nguồn gốc, công chứng số nơi các bên không tin tưởng nhau. |
