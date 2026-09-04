// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title NotaryRegistry - Chứng thực tài liệu (Proof of Existence)
 * @notice Minh họa ứng dụng điển hình của Blockchain trong bảo toàn tính toàn vẹn dữ liệu
 * 
 * VẤN ĐỀ TRONG SQL / MẠNG TRUYỀN THỐNG:
 * - Khi lưu trữ mã băm file trên cơ sở dữ liệu tập trung (MySQL/Postgres),
 *   quản trị viên (DBA) hoặc hacker xâm nhập có thể chạy lệnh:
 *   `UPDATE documents SET file_hash = '...' WHERE id = 1;`
 *   để tráo đổi nội dung tài liệu mà không ai phát hiện được.
 * 
 * GIẢI PHÁP BLOCKCHAIN:
 * - Lưu `bytes32 fileHash` vào chuỗi khối.
 * - Mã băm được gắn chặt với `block.timestamp` và chữ ký số `msg.sender`.
 * - Tính chất chuỗi khối (mỗi block băm dữ liệu của block trước) đảm bảo
 *   không ai có thể thay đổi thời gian hoặc mã băm đã được xác nhận.
 */
contract NotaryRegistry {
    struct DocumentRecord {
        bytes32 docHash;       // Mã băm SHA-256 hoặc Keccak-256 của tài liệu (32 bytes)
        address notarizedBy;   // Người sở hữu / người đăng ký
        uint256 timestamp;     // Thời điểm khối được đào
        string metadata;       // Mô tả ngắn hoặc tên văn bản
    }

    // Mapping từ mã băm của tài liệu sang bản ghi chi tiết
    mapping(bytes32 => DocumentRecord) public records;

    // Sự kiện khi tài liệu mới được đóng dấu thời gian
    event DocumentNotarized(
        bytes32 indexed docHash,
        address indexed notarizedBy,
        uint256 timestamp,
        string metadata
    );

    /**
     * @dev Đăng ký chứng thực một mã băm tài liệu mới
     * @param _docHash Mã băm 32 bytes của tài liệu (tính ở client/máy người dùng)
     * @param _metadata Tên tài liệu hoặc mã số sinh viên / hợp đồng
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
     * @dev Kiểm tra xác thực xem một mã băm đã từng tồn tại và ai là người chứng thực
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
