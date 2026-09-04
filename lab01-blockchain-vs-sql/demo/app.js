/**
 * APP.JS - MÔ PHỎNG TƯƠNG TÁC: SQL CLIENT-SERVER VS BLOCKCHAIN P2P SOLIDITY
 * Thiết kế giao diện và hiệu ứng mạng máy tính cho sinh viên môn Chuỗi khối
 */

// Helper: tính mã băm SHA-256 thật bằng Web Crypto API
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// ============================================================================
// 1. MÔ PHỎNG CANVAS MẠNG CLIENT-SERVER (SQL)
// ============================================================================
const sqlCanvas = document.getElementById('sqlNetworkCanvas');
const sqlCtx = sqlCanvas ? sqlCanvas.getContext('2d') : null;

let sqlPackets = [];
const sqlServerNode = { x: 0, y: 0, label: 'DB SERVER', type: 'server' };
const sqlClientNodes = [];

function initSqlNetwork() {
  if (!sqlCanvas) return;
  const rect = sqlCanvas.parentElement.getBoundingClientRect();
  sqlCanvas.width = rect.width;
  sqlCanvas.height = 220;

  const cx = sqlCanvas.width / 2;
  const cy = sqlCanvas.height / 2;
  sqlServerNode.x = cx;
  sqlServerNode.y = cy;

  sqlClientNodes.length = 0;
  const radius = Math.min(cx, cy) - 35;
  const clientCount = 4;
  for (let i = 0; i < clientCount; i++) {
    const angle = (i / clientCount) * Math.PI * 2 - Math.PI / 4;
    sqlClientNodes.push({
      x: cx + Math.cos(angle) * radius,
      y: cy + Math.sin(angle) * radius,
      label: `Client ${i + 1}`,
      type: 'client'
    });
  }
}

function triggerSqlPacket(clientIndex = 0) {
  if (!sqlClientNodes[clientIndex]) return;
  const client = sqlClientNodes[clientIndex];
  // Packet từ client tới server
  sqlPackets.push({
    startX: client.x,
    startY: client.y,
    targetX: sqlServerNode.x,
    targetY: sqlServerNode.y,
    progress: 0,
    speed: 0.05,
    color: '#00f0ff',
    returning: false,
    clientRef: client
  });
}

function updateAndDrawSqlNetwork() {
  if (!sqlCtx) return;
  sqlCtx.clearRect(0, 0, sqlCanvas.width, sqlCanvas.height);

  // 1. Vẽ đường kết nối hình sao (Star Topology)
  sqlCtx.strokeStyle = '#172554';
  sqlCtx.lineWidth = 1.5;
  sqlCtx.setLineDash([3, 3]);
  sqlClientNodes.forEach(node => {
    sqlCtx.beginPath();
    sqlCtx.moveTo(node.x, node.y);
    sqlCtx.lineTo(sqlServerNode.x, sqlServerNode.y);
    sqlCtx.stroke();
  });
  sqlCtx.setLineDash([]);

  // 2. Cập nhật và vẽ các gói tin TCP đang bay
  for (let i = sqlPackets.length - 1; i >= 0; i--) {
    const p = sqlPackets[i];
    p.progress += p.speed;
    const curX = p.startX + (p.targetX - p.startX) * p.progress;
    const curY = p.startY + (p.targetY - p.startY) * p.progress;

    sqlCtx.fillStyle = p.color;
    sqlCtx.shadowColor = p.color;
    sqlCtx.shadowBlur = 8;
    sqlCtx.beginPath();
    sqlCtx.arc(curX, curY, 4, 0, Math.PI * 2);
    sqlCtx.fill();
    sqlCtx.shadowBlur = 0;

    if (p.progress >= 1) {
      if (!p.returning) {
        // Đến server, phản hồi ngược về client
        p.startX = sqlServerNode.x;
        p.startY = sqlServerNode.y;
        p.targetX = p.clientRef.x;
        p.targetY = p.clientRef.y;
        p.progress = 0;
        p.returning = true;
      } else {
        sqlPackets.splice(i, 1);
      }
    }
  }

  // 3. Vẽ Client Nodes
  sqlClientNodes.forEach(node => {
    sqlCtx.fillStyle = '#0f172a';
    sqlCtx.strokeStyle = '#38bdf8';
    sqlCtx.lineWidth = 2;
    sqlCtx.beginPath();
    sqlCtx.arc(node.x, node.y, 10, 0, Math.PI * 2);
    sqlCtx.fill();
    sqlCtx.stroke();

    sqlCtx.fillStyle = '#94a3b8';
    sqlCtx.font = '10px "JetBrains Mono"';
    sqlCtx.textAlign = 'center';
    sqlCtx.fillText(node.label, node.x, node.y + 20);
  });

  // 4. Vẽ Server Node trung tâm
  sqlCtx.fillStyle = '#0284c7';
  sqlCtx.shadowColor = '#00f0ff';
  sqlCtx.shadowBlur = 12;
  sqlCtx.beginPath();
  sqlCtx.arc(sqlServerNode.x, sqlServerNode.y, 16, 0, Math.PI * 2);
  sqlCtx.fill();
  sqlCtx.shadowBlur = 0;

  sqlCtx.fillStyle = '#ffffff';
  sqlCtx.font = 'bold 9px "JetBrains Mono"';
  sqlCtx.textAlign = 'center';
  sqlCtx.fillText('SQL DB', sqlServerNode.x, sqlServerNode.y + 3);
  sqlCtx.fillStyle = '#00f0ff';
  sqlCtx.fillText('CENTRAL', sqlServerNode.x, sqlServerNode.y + 28);
}


// ============================================================================
// 2. MÔ PHỎNG CANVAS MẠNG P2P GOSSIP (SOLIDITY BLOCKCHAIN)
// ============================================================================
const p2pCanvas = document.getElementById('p2pNetworkCanvas');
const p2pCtx = p2pCanvas ? p2pCanvas.getContext('2d') : null;

let p2pNodes = [];
let p2pEdges = [];
let p2pPackets = [];

function initP2PNetwork() {
  if (!p2pCanvas) return;
  const rect = p2pCanvas.parentElement.getBoundingClientRect();
  p2pCanvas.width = rect.width;
  p2pCanvas.height = 220;

  const cx = p2pCanvas.width / 2;
  const cy = p2pCanvas.height / 2;
  const rx = p2pCanvas.width * 0.4;
  const ry = p2pCanvas.height * 0.35;

  p2pNodes = [];
  const nodeCount = 7;
  for (let i = 0; i < nodeCount; i++) {
    const angle = (i / nodeCount) * Math.PI * 2;
    // Điểm hơi lệch ngẫu nhiên để tạo cảm giác Mesh topology tự nhiên
    const jitterX = ((i % 3) - 1) * 12;
    const jitterY = (((i + 1) % 3) - 1) * 10;
    p2pNodes.push({
      id: i,
      x: cx + Math.cos(angle) * rx + jitterX,
      y: cy + Math.sin(angle) * ry + jitterY,
      label: `Node ${String.fromCharCode(65 + i)}`,
      pulseRadius: 0,
      isMining: false
    });
  }

  // Tạo các cạnh liên kết Mesh (mỗi node liên kết với 2-3 láng giềng)
  p2pEdges = [];
  for (let i = 0; i < nodeCount; i++) {
    const next = (i + 1) % nodeCount;
    p2pEdges.push([i, next]);
    const cross = (i + 2) % nodeCount;
    if (i % 2 === 0) p2pEdges.push([i, cross]);
  }
}

function triggerGossipWave(sourceNodeId = 0) {
  if (!p2pNodes.length) return;

  const visited = new Set();
  const queue = [{ id: sourceNodeId, delay: 0 }];
  visited.add(sourceNodeId);

  while (queue.length > 0) {
    const { id, delay } = queue.shift();
    const currentNode = p2pNodes[id];

    // Tạo hiệu ứng sóng lan truyền (Gossip wave)
    setTimeout(() => {
      currentNode.pulseRadius = 1;
    }, delay);

    // Tìm các node láng giềng trong p2pEdges
    const neighbors = [];
    p2pEdges.forEach(([u, v]) => {
      if (u === id && !visited.has(v)) neighbors.push(v);
      if (v === id && !visited.has(u)) neighbors.push(u);
    });

    neighbors.forEach(neighborId => {
      visited.add(neighborId);
      const targetNode = p2pNodes[neighborId];

      setTimeout(() => {
        p2pPackets.push({
          startX: currentNode.x,
          startY: currentNode.y,
          targetX: targetNode.x,
          targetY: targetNode.y,
          progress: 0,
          speed: 0.07,
          color: '#f59e0b'
        });
      }, delay);

      queue.push({ id: neighborId, delay: delay + 180 });
    });
  }
}

function updateAndDrawP2PNetwork() {
  if (!p2pCtx) return;
  p2pCtx.clearRect(0, 0, p2pCanvas.width, p2pCanvas.height);

  // 1. Vẽ các cạnh liên kết P2P Mesh
  p2pCtx.strokeStyle = '#272015';
  p2pCtx.lineWidth = 1.5;
  p2pEdges.forEach(([u, v]) => {
    const n1 = p2pNodes[u];
    const n2 = p2pNodes[v];
    if (n1 && n2) {
      p2pCtx.beginPath();
      p2pCtx.moveTo(n1.x, n1.y);
      p2pCtx.lineTo(n2.x, n2.y);
      p2pCtx.stroke();
    }
  });

  // 2. Vẽ các gói tin Gossip lan truyền
  for (let i = p2pPackets.length - 1; i >= 0; i--) {
    const p = p2pPackets[i];
    p.progress += p.speed;
    const curX = p.startX + (p.targetX - p.startX) * p.progress;
    const curY = p.startY + (p.targetY - p.startY) * p.progress;

    p2pCtx.fillStyle = p.color;
    p2pCtx.shadowColor = p.color;
    p2pCtx.shadowBlur = 8;
    p2pCtx.beginPath();
    p2pCtx.arc(curX, curY, 3.5, 0, Math.PI * 2);
    p2pCtx.fill();
    p2pCtx.shadowBlur = 0;

    if (p.progress >= 1) {
      p2pPackets.splice(i, 1);
    }
  }

  // 3. Vẽ Nodes và hiệu ứng vòng sóng lan tỏa (Gossip rings)
  p2pNodes.forEach(node => {
    if (node.pulseRadius > 0) {
      node.pulseRadius += 0.6;
      p2pCtx.strokeStyle = `rgba(245, 158, 11, ${Math.max(0, 1 - node.pulseRadius / 22)})`;
      p2pCtx.lineWidth = 1.5;
      p2pCtx.beginPath();
      p2pCtx.arc(node.x, node.y, node.pulseRadius, 0, Math.PI * 2);
      p2pCtx.stroke();
      if (node.pulseRadius > 22) node.pulseRadius = 0;
    }

    p2pCtx.fillStyle = '#1c1917';
    p2pCtx.strokeStyle = isChainTampered ? '#ef4444' : '#f59e0b';
    p2pCtx.lineWidth = 2;
    p2pCtx.beginPath();
    p2pCtx.arc(node.x, node.y, 9, 0, Math.PI * 2);
    p2pCtx.fill();
    p2pCtx.stroke();

    p2pCtx.fillStyle = isChainTampered ? '#fca5a5' : '#e2e8f0';
    p2pCtx.font = '9px "JetBrains Mono"';
    p2pCtx.textAlign = 'center';
    p2pCtx.fillText(node.label, node.x, node.y + 18);
  });
}

// Vòng lặp Render chung cho cả 2 Canvas
function renderLoop() {
  updateAndDrawSqlNetwork();
  updateAndDrawP2PNetwork();
  requestAnimationFrame(renderLoop);
}

// ============================================================================
// 3. LOGIC TRẠNG THÁI DỮ LIỆU SQL
// ============================================================================
let sqlAccounts = {
  Alice: 500,
  Bob: 200,
  Charlie: 100
};
let sqlQueryCount = 15773;

function renderSqlTable(highlightKey = null, isTampered = false) {
  const tbody = document.getElementById('sqlTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  for (const [name, balance] of Object.entries(sqlAccounts)) {
    const tr = document.createElement('tr');
    if (highlightKey === name) tr.classList.add('highlight-update');
    if (isTampered && name === 'Alice') tr.classList.add('tampered');

    tr.innerHTML = `
      <td>0x${name}</td>
      <td><strong>${balance.toLocaleString()} ETH</strong></td>
      <td>${new Date().toLocaleTimeString()}</td>
    `;
    tbody.appendChild(tr);
  }
}

function executeSqlQuery() {
  if (sqlAccounts.Alice >= 50) {
    sqlAccounts.Alice -= 50;
    sqlAccounts.Bob += 50;
  } else {
    sqlAccounts.Alice += 150;
  }
  sqlQueryCount++;
  document.getElementById('sqlMetricCounter').innerText = `${sqlQueryCount.toLocaleString()} QUERIES`;

  triggerSqlPacket(0);
  renderSqlTable('Alice', false);
}

function dbaTamperSql() {
  sqlAccounts.Alice = 999999;
  renderSqlTable('Alice', true);
  alert(
    "[SQL DBA TAMPER THÀNH CÔNG]\n" +
    "Quản trị viên đã chạy lệnh:\n" +
    "UPDATE accounts SET balance = 999999 WHERE id = 'Alice';\n\n" +
    "=> Máy chủ trung tâm lưu dữ liệu ngay lập tức! Không có cảnh báo mật mã nào được kích hoạt."
  );
}


// ============================================================================
// 4. LOGIC CHUỖI KHỐI SOLIDITY (BLOCKCHAIN)
// ============================================================================
let blockchain = [];
let isChainTampered = false;
let blockCounter = 4;

async function initBlockchain() {
  blockchain = [];
  const genesisHash = await sha256("0|2026-01-01|Genesis Block|0000000000000000");
  blockchain.push({
    index: 0,
    data: "Genesis Block",
    prevHash: "00000000",
    hash: genesisHash.slice(0, 8),
    fullHash: genesisHash,
    tampered: false
  });

  const b1Hash = await sha256(`1|Deposit 500 ETH|${genesisHash}`);
  blockchain.push({
    index: 1,
    data: "Deposit 500 ETH",
    prevHash: genesisHash.slice(0, 8),
    hash: b1Hash.slice(0, 8),
    fullHash: b1Hash,
    tampered: false
  });

  const b2Hash = await sha256(`2|Transfer 50 Alice->Bob|${b1Hash}`);
  blockchain.push({
    index: 2,
    data: "Alice->Bob: 50 ETH",
    prevHash: b1Hash.slice(0, 8),
    hash: b2Hash.slice(0, 8),
    fullHash: b2Hash,
    tampered: false
  });

  renderBlockchainCards();
}

function renderBlockchainCards() {
  const container = document.getElementById('blockchainBlocks');
  if (!container) return;
  container.innerHTML = '';

  blockchain.forEach((block, idx) => {
    const card = document.createElement('div');
    card.className = 'block-card';
    if (idx === blockchain.length - 1 && !isChainTampered) card.classList.add('latest');
    if (block.tampered) card.classList.add('tampered');

    card.innerHTML = `
      <div class="block-header">
        <span>#${block.index}</span>
        <span>${block.tampered ? 'INVALID ✗' : 'VALID ✓'}</span>
      </div>
      <div class="block-field">Data: <span>${block.data}</span></div>
      <div class="block-field">Prev: <span>${block.prevHash}</span></div>
      <div class="block-field">Hash: <span>${block.hash}</span></div>
    `;
    container.appendChild(card);
  });
}

async function addBlockchainTransaction() {
  if (isChainTampered) {
    alert("Chuỗi hiện đang bị đứt gãy do phát hiện gian lận! Vui lòng khôi phục chuỗi đồng thuận trước.");
    return;
  }

  blockCounter++;
  const prevBlock = blockchain[blockchain.length - 1];
  const newIndex = blockchain.length;
  const newData = `Alice->Bob: 20 ETH`;
  const newHash = await sha256(`${newIndex}|${newData}|${prevBlock.fullHash}`);

  triggerGossipWave(0);

  setTimeout(() => {
    blockchain.push({
      index: newIndex,
      data: newData,
      prevHash: prevBlock.hash,
      hash: newHash.slice(0, 8),
      fullHash: newHash,
      tampered: false
    });
    document.getElementById('solidityMetricCounter').innerText = `BLOCK #${String(blockCounter).padStart(2, '0')}`;
    renderBlockchainCards();
  }, 400);
}

async function toggleTamperBlockchain() {
  const btn = document.getElementById('btnTamperBlockchain');
  if (!isChainTampered) {
    // Sửa khối số 1
    isChainTampered = true;
    blockchain[1].data = "HACK: Alice->Bob: 9999 ETH";
    const fakeHash = await sha256(`1|HACK|${blockchain[0].fullHash}`);
    blockchain[1].hash = fakeHash.slice(0, 8);
    blockchain[1].tampered = true;

    // Các khối sau bị đứt liên kết
    for (let i = 2; i < blockchain.length; i++) {
      blockchain[i].tampered = true;
    }

    renderBlockchainCards();
    if (btn) btn.innerText = "🛡️ Khôi Phục Chuỗi Đồng Thuận";

    alert(
      "[CẢNH BÁO BẢO MẬT: TAMPER DETECTED!]\n\n" +
      "Hacker đã sửa dữ liệu tại Khối #1.\n" +
      "Mã Hash của Khối #1 thay đổi -> Không còn khớp với PrevHash của Khối #2!\n" +
      "=> Toàn bộ chuỗi khối bị đứt gãy. Các Node khác trong mạng P2P lập tức TỪ CHỐI khối giả mạo này!"
    );
  } else {
    // Khôi phục đồng thuận
    isChainTampered = false;
    await initBlockchain();
    if (btn) btn.innerText = "💥 Tấn Công Sửa Khối Cũ";
  }
}

// Accordion hướng dẫn học
function toggleStudyGuide() {
  const content = document.getElementById('studyGuideContent');
  const icon = document.getElementById('guideToggleIcon');
  if (!content) return;
  if (content.style.display === 'none' || !content.style.display) {
    content.style.display = 'flex';
    if (icon) icon.innerText = '▲';
  } else {
    content.style.display = 'none';
    if (icon) icon.innerText = '▼';
  }
}

// ============================================================================
// KHỞI ĐỘNG HỆ THỐNG
// ============================================================================
window.addEventListener('load', async () => {
  initSqlNetwork();
  initP2PNetwork();
  renderSqlTable();
  await initBlockchain();
  renderLoop();

  window.addEventListener('resize', () => {
    initSqlNetwork();
    initP2PNetwork();
  });
});
