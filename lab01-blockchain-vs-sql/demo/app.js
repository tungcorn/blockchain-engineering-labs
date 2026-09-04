/**
 * APP.JS - MÔ PHỎNG NÂNG CAO: SQL CLIENT-SERVER VS BLOCKCHAIN SOLIDITY
 * Tích hợp Web Audio API Synthesizer 2.0, Race Mode, và Block Inspector Modal
 */

// ============================================================================
// 1. WEB AUDIO API SYNTHESIZER 2.0 (HỆ THỐNG ÂM THANH HI-TECH THUẦN TÚY)
// ============================================================================
let audioCtx = null;
let soundEnabled = true;

function initAudio() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) audioCtx = new AudioContext();
  }
}

// Thang âm ngũ cung cho Gossip Arpeggio
const gossipPitches = [261.63, 329.63, 392.00, 493.88, 523.25, 659.25, 783.99];

function playSound(type, param = 0) {
  if (!soundEnabled) return;
  initAudio();
  if (!audioCtx) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const now = audioCtx.currentTime;

  if (type === 'hover') {
    // Tiếng tick rất khẽ khi rê chuột qua phần tử tương tác
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, now);
    gain.gain.setValueAtTime(0.02, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.015);
    osc.start(now);
    osc.stop(now + 0.015);
  } else if (type === 'click') {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.04);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.04);
    osc.start(now);
    osc.stop(now + 0.04);
  } else if (type === 'tcp_send') {
    // Tiếng gói tin TCP phóng đi
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.06);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.06);
    osc.start(now);
    osc.stop(now + 0.06);
  } else if (type === 'gossip_hop') {
    // Tiếng từng node nhận gói tin gossip (tạo thành chuỗi hợp âm)
    const pitch = gossipPitches[param % gossipPitches.length];
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(pitch, now);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.005, now + 0.18);
    osc.start(now);
    osc.stop(now + 0.18);
  } else if (type === 'block_mined') {
    // Tiếng chuông pha lê khi đào và gắn khối thành công (2 oscillator hòa âm)
    [587.33, 880.00].forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.04);
      gain.gain.setValueAtTime(0.12, now + i * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.35);
      osc.start(now + i * 0.04);
      osc.stop(now + 0.35);
    });
  } else if (type === 'alarm') {
    // Còi báo động hai tông luân phiên khi bị sửa trộm hoặc tấn công
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.setValueAtTime(320, now + 0.08);
    osc.frequency.setValueAtTime(520, now + 0.16);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.28);
    osc.start(now);
    osc.stop(now + 0.28);
  } else if (type === 'restore') {
    // Hợp âm chiến thắng khi khôi phục đồng thuận
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);
      gain.gain.setValueAtTime(0.12, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.4);
      osc.start(now + idx * 0.06);
      osc.stop(now + 0.4);
    });
  } else if (type === 'modal_open') {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(350, now);
    osc.frequency.exponentialRampToValueAtTime(700, now + 0.08);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.08);
    osc.start(now);
    osc.stop(now + 0.08);
  } else if (type === 'modal_close') {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.05);
    osc.start(now);
    osc.stop(now + 0.05);
  }
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  const btn = document.getElementById('soundToggleBtn');
  if (btn) {
    btn.innerHTML = soundEnabled ? '🔊 SFX: ON' : '🔇 SFX: OFF';
  }
  if (soundEnabled) playSound('click');
}

// Helper tính SHA-256 thật bằng Web Crypto
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// ============================================================================
// CYBERPUNK HUD TOAST NOTIFICATION SYSTEM (THAY THẾ HOÀN TOÀN WINDOW.ALERT)
// ============================================================================
function showCyberToast(options) {
  const {
    title = 'THÔNG BÁO HỆ THỐNG',
    type = 'cyan', // 'cyan', 'amber', 'danger', 'success'
    message = '',
    duration = 6500
  } = options;

  let container = document.getElementById('cyberToastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'cyberToastContainer';
    container.className = 'cyber-toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `cyber-toast ${type}`;

  const iconMap = {
    danger: '⚠️',
    cyan: '🌐',
    amber: '⚡',
    success: '✓'
  };

  toast.innerHTML = `
    <div class="toast-header">
      <div class="toast-title">
        <span>${iconMap[type] || '🔔'}</span>
        <span>${title}</span>
      </div>
      <button class="toast-close-btn" title="Đóng">&times;</button>
    </div>
    <div class="toast-body">${message}</div>
    <div class="toast-footer">
      <button class="toast-action-btn">Đã hiểu ✓</button>
    </div>
    <div class="toast-progress-bar"></div>
  `;

  container.appendChild(toast);

  // Hiệu ứng trượt vào
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  const closeToast = () => {
    toast.classList.remove('show');
    toast.classList.add('hide');
    setTimeout(() => {
      if (toast.parentElement) toast.parentElement.removeChild(toast);
    }, 350);
  };

  toast.querySelector('.toast-close-btn').addEventListener('click', () => {
    playSound('click');
    closeToast();
  });
  toast.querySelector('.toast-action-btn').addEventListener('click', () => {
    playSound('click');
    closeToast();
  });

  if (duration > 0) {
    const progressBar = toast.querySelector('.toast-progress-bar');
    if (progressBar) {
      progressBar.style.transition = `width ${duration}ms linear`;
      requestAnimationFrame(() => {
        progressBar.style.width = '0%';
      });
    }
    setTimeout(closeToast, duration);
  }
}

// ============================================================================
// 2. CANVAS MẠNG MÁY TÍNH CLIENT - SERVER (SQL RDBMS)
// ============================================================================
const sqlCanvas = document.getElementById('sqlNetworkCanvas');
const sqlCtx = sqlCanvas ? sqlCanvas.getContext('2d') : null;

let sqlPackets = [];
let sqlRadarAngle = 0;
const sqlServerNode = { x: 0, y: 0, label: 'CENTRAL DB', type: 'server' };
const sqlClientNodes = [];

let isSqlServerDown = false;
let isP2PPartitioned = false;

function initSqlNetwork() {
  if (!sqlCanvas) return;
  const rect = sqlCanvas.parentElement.getBoundingClientRect();
  sqlCanvas.width = rect.width;
  sqlCanvas.height = 270;

  const cx = sqlCanvas.width / 2;
  const cy = 135;
  sqlServerNode.x = cx;
  sqlServerNode.y = cy;

  sqlClientNodes.length = 0;
  const rx = Math.min(cx * 0.72, 175);
  const ry = Math.min(cy * 0.62, 75);
  const labels = ['Alice (0x71c)', 'Bob (0x94f)', 'Charlie', 'Dave'];

  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2 - Math.PI / 4;
    sqlClientNodes.push({
      x: cx + Math.cos(angle) * rx,
      y: cy + Math.sin(angle) * ry,
      label: labels[i],
      isAlice: i === 0,
      isBob: i === 1,
      pulse: 0
    });
  }
}

function triggerSqlPacket(clientIndex = 0) {
  if (isSqlServerDown) {
    playSound('alarm');
    updateSqlHud(`[TCP 192.168.1.10:5432] ECONNREFUSED - Connection dropped (Single Point of Failure)!`, true);
    return;
  }

  if (!sqlClientNodes[clientIndex]) return;
  const client = sqlClientNodes[clientIndex];
  client.pulse = 1;
  playSound('tcp_send');

  sqlPackets.push({
    startX: client.x,
    startY: client.y,
    targetX: sqlServerNode.x,
    targetY: sqlServerNode.y,
    progress: 0,
    speed: 0.07,
    color: '#00f0ff',
    returning: false,
    clientRef: client
  });

  updateSqlHud(`[TCP 192.168.1.10:5432] SYN -> ACK | UPDATE accounts SET balance = balance - 50 (0.82ms)`);
}

function updateSqlHud(msg, isAlert = false) {
  const hud = document.getElementById('sqlHud');
  if (!hud) return;
  hud.className = `network-hud cyan ${isAlert ? 'alert' : ''}`;
  hud.innerHTML = `<span class="hud-prompt">&gt;</span> <span class="hud-log">${msg}</span>`;
}

function drawCyberGrid(ctx, w, h, tint = 'cyan') {
  ctx.strokeStyle = tint === 'cyan' ? 'rgba(0, 240, 255, 0.03)' : 'rgba(245, 158, 11, 0.03)';
  ctx.lineWidth = 1;
  const step = 24;

  for (let x = 0; x < w; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y < h; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
}

function updateAndDrawSqlNetwork() {
  if (!sqlCtx) return;
  const w = sqlCanvas.width;
  const h = sqlCanvas.height;
  sqlCtx.clearRect(0, 0, w, h);

  // 1. Nền lưới cyberpunk
  drawCyberGrid(sqlCtx, w, h, 'cyan');

  // 2. Radar sweep quanh Server trung tâm (hoặc nhấp nháy cảnh báo nếu sập)
  if (!isSqlServerDown) {
    sqlRadarAngle += 0.03;
    sqlCtx.save();
    sqlCtx.beginPath();
    sqlCtx.arc(sqlServerNode.x, sqlServerNode.y, 45, 0, Math.PI * 2);
    sqlCtx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
    sqlCtx.stroke();
    sqlCtx.beginPath();
    sqlCtx.moveTo(sqlServerNode.x, sqlServerNode.y);
    sqlCtx.arc(sqlServerNode.x, sqlServerNode.y, 45, sqlRadarAngle, sqlRadarAngle + 0.5);
    sqlCtx.closePath();
    sqlCtx.fillStyle = 'rgba(0, 240, 255, 0.04)';
    sqlCtx.fill();
    sqlCtx.restore();
  } else {
    // Vòng đỏ cảnh báo sập máy chủ SPOF
    sqlCtx.save();
    sqlCtx.beginPath();
    sqlCtx.arc(sqlServerNode.x, sqlServerNode.y, 35 + Math.sin(Date.now() / 200) * 5, 0, Math.PI * 2);
    sqlCtx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
    sqlCtx.lineWidth = 2;
    sqlCtx.stroke();
    sqlCtx.restore();
  }

  // 3. Đường kết nối hình sao (Star Topology bus lines)
  sqlClientNodes.forEach(node => {
    sqlCtx.strokeStyle = isSqlServerDown ? 'rgba(239, 68, 68, 0.2)' : '#142033';
    sqlCtx.lineWidth = 1.5;
    sqlCtx.setLineDash([4, 4]);
    sqlCtx.beginPath();
    sqlCtx.moveTo(node.x, node.y);
    sqlCtx.lineTo(sqlServerNode.x, sqlServerNode.y);
    sqlCtx.stroke();
    sqlCtx.setLineDash([]);
  });

  // 4. Các gói tin TCP bay qua lại
  for (let i = sqlPackets.length - 1; i >= 0; i--) {
    const p = sqlPackets[i];
    p.progress += p.speed;
    const curX = p.startX + (p.targetX - p.startX) * p.progress;
    const curY = p.startY + (p.targetY - p.startY) * p.progress;

    sqlCtx.fillStyle = p.color;
    sqlCtx.shadowColor = p.color;
    sqlCtx.shadowBlur = 10;
    sqlCtx.beginPath();
    sqlCtx.arc(curX, curY, 4, 0, Math.PI * 2);
    sqlCtx.fill();
    sqlCtx.shadowBlur = 0;

    if (p.progress >= 1) {
      if (!p.returning) {
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

  // 5. Vẽ Client Nodes
  sqlClientNodes.forEach(node => {
    if (node.pulse > 0) {
      node.pulse += 0.5;
      sqlCtx.strokeStyle = `rgba(0, 240, 255, ${Math.max(0, 1 - node.pulse / 20)})`;
      sqlCtx.lineWidth = 2;
      sqlCtx.beginPath();
      sqlCtx.arc(node.x, node.y, 8 + node.pulse, 0, Math.PI * 2);
      sqlCtx.stroke();
      if (node.pulse > 20) node.pulse = 0;
    }

    let borderColor = '#38bdf8';
    if (node.isAlice) borderColor = '#38bdf8';
    if (node.isBob) borderColor = '#34d399';

    sqlCtx.fillStyle = '#0b1320';
    sqlCtx.strokeStyle = borderColor;
    sqlCtx.lineWidth = 2;
    sqlCtx.beginPath();
    sqlCtx.arc(node.x, node.y, 10, 0, Math.PI * 2);
    sqlCtx.fill();
    sqlCtx.stroke();

    if (node.isAlice || node.isBob) {
      sqlCtx.fillStyle = node.isAlice ? '#38bdf8' : '#34d399';
      sqlCtx.beginPath();
      sqlCtx.arc(node.x, node.y, 4, 0, Math.PI * 2);
      sqlCtx.fill();
    }

    sqlCtx.fillStyle = '#94a3b8';
    sqlCtx.font = '10px "JetBrains Mono"';
    sqlCtx.textAlign = 'center';
    sqlCtx.fillText(node.label, node.x, node.y + 22);
  });

  // 6. Vẽ Server Node trung tâm
  if (!isSqlServerDown) {
    sqlCtx.fillStyle = '#0284c7';
    sqlCtx.shadowColor = '#00f0ff';
    sqlCtx.shadowBlur = 16;
    sqlCtx.beginPath();
    sqlCtx.arc(sqlServerNode.x, sqlServerNode.y, 18, 0, Math.PI * 2);
    sqlCtx.fill();
    sqlCtx.shadowBlur = 0;

    sqlCtx.fillStyle = '#ffffff';
    sqlCtx.font = 'bold 9px "JetBrains Mono"';
    sqlCtx.textAlign = 'center';
    sqlCtx.fillText('SQL DB', sqlServerNode.x, sqlServerNode.y + 3);
    sqlCtx.fillStyle = '#00f0ff';
    sqlCtx.fillText('CENTRAL', sqlServerNode.x, sqlServerNode.y + 30);
  } else {
    // Máy chủ sập nguồn (SPOF)
    sqlCtx.fillStyle = '#7f1d1d';
    sqlCtx.strokeStyle = '#ef4444';
    sqlCtx.lineWidth = 2;
    sqlCtx.shadowColor = '#ef4444';
    sqlCtx.shadowBlur = 20;
    sqlCtx.beginPath();
    sqlCtx.arc(sqlServerNode.x, sqlServerNode.y, 18, 0, Math.PI * 2);
    sqlCtx.fill();
    sqlCtx.stroke();
    sqlCtx.shadowBlur = 0;

    sqlCtx.fillStyle = '#ffffff';
    sqlCtx.font = 'bold 11px "JetBrains Mono"';
    sqlCtx.textAlign = 'center';
    sqlCtx.fillText('✕', sqlServerNode.x, sqlServerNode.y + 4);
    sqlCtx.fillStyle = '#ef4444';
    sqlCtx.font = 'bold 8px "JetBrains Mono"';
    sqlCtx.fillText('SPOF CRASH', sqlServerNode.x, sqlServerNode.y + 30);
  }
}


// ============================================================================
// 3. CANVAS MẠNG MÁY TÍNH PEER-TO-PEER GOSSIP (SOLIDITY BLOCKCHAIN)
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
  p2pCanvas.height = 270;

  const cx = p2pCanvas.width / 2;
  const cy = 135;
  const rx = Math.min(cx * 0.75, 180);
  const ry = Math.min(cy * 0.62, 75);

  p2pNodes = [];
  const nodeCount = 7;
  const labels = [
    'Node A (Alice)',
    'Node B (Bob)',
    'Node C',
    'Node D (Validator)',
    'Node E',
    'Node F',
    'Node G'
  ];

  for (let i = 0; i < nodeCount; i++) {
    const angle = (i / nodeCount) * Math.PI * 2;
    const jitterX = ((i % 3) - 1) * 8;
    const jitterY = (((i + 1) % 3) - 1) * 6;
    p2pNodes.push({
      id: i,
      x: cx + Math.cos(angle) * rx + jitterX,
      y: cy + Math.sin(angle) * ry + jitterY,
      label: labels[i],
      isAlice: i === 0,
      isBob: i === 1,
      isValidator: i === 3,
      pulseRadius: 0
    });
  }

  p2pEdges = [];
  for (let i = 0; i < nodeCount; i++) {
    const next = (i + 1) % nodeCount;
    p2pEdges.push([i, next]);
    const cross = (i + 2) % nodeCount;
    if (i % 2 === 0) p2pEdges.push([i, cross]);
  }
}

function updateBlockchainHud(msg, isAlert = false) {
  const hud = document.getElementById('blockchainHud');
  if (!hud) return;
  hud.className = `network-hud amber ${isAlert ? 'alert' : ''}`;
  hud.innerHTML = `<span class="hud-prompt">&gt;</span> <span class="hud-log">${msg}</span>`;
}

function triggerGossipWave(sourceNodeId = 0, onComplete = null) {
  if (!p2pNodes.length) return;
  updateBlockchainHud(`[P2P GOSSIP] Node_A broadcasts Tx (Alice->Bob 20 ETH) to peers...`);

  const visited = new Set();
  const queue = [{ id: sourceNodeId, delay: 0, hop: 0 }];
  visited.add(sourceNodeId);

  let maxDelay = 0;

  while (queue.length > 0) {
    const { id, delay, hop } = queue.shift();
    const currentNode = p2pNodes[id];
    if (delay > maxDelay) maxDelay = delay;

    setTimeout(() => {
      currentNode.pulseRadius = 1;
      playSound('gossip_hop', hop);
    }, delay);

    const neighbors = [];
    p2pEdges.forEach(([u, v]) => {
      if (u === id && !visited.has(v)) neighbors.push(v);
      if (v === id && !visited.has(u)) neighbors.push(u);
    });

    neighbors.forEach(neighborId => {
      if (isP2PPartitioned && (neighborId === 2 || neighborId === 4)) return; // Bỏ qua node bị rớt mạng
      visited.add(neighborId);
      const targetNode = p2pNodes[neighborId];

      setTimeout(() => {
        p2pPackets.push({
          startX: currentNode.x,
          startY: currentNode.y,
          targetX: targetNode.x,
          targetY: targetNode.y,
          progress: 0,
          speed: 0.075,
          color: '#f59e0b'
        });
      }, delay);

      queue.push({ id: neighborId, delay: delay + 160, hop: hop + 1 });
    });
  }

  setTimeout(() => {
    playSound('block_mined');
    if (isP2PPartitioned) {
      updateBlockchainHud(`[BFT CONSENSUS] 5/5 surviving peers agreed! Byzantine Fault Tolerance: Network survived 2 node failures.`);
    } else {
      updateBlockchainHud(`[CONSENSUS] 7/7 Nodes verified ECDSA signature · Block mined into ledger.`);
    }
    if (onComplete) onComplete();
  }, maxDelay + 250);
}

function toggleP2PPartition() {
  isP2PPartitioned = !isP2PPartitioned;
  const btn = document.getElementById('btnPartitionP2P');
  if (isP2PPartitioned) {
    playSound('alarm');
    if (btn) {
      btn.innerHTML = "🟢 Bật Lại 7 Node";
      btn.className = "btn btn-amber";
    }
    updateBlockchainHud(`[BFT SIMULATION] Node C & Node E offline! 5/7 peers remain. Testing mesh resilience...`, true);
    showCyberToast({
      title: 'MẠNG P2P: CHỊU LỖI BYZANTINE (BFT)',
      type: 'amber',
      message: 'Đã ngắt kết nối Node C và Node E (2/7 node trong mạng bị rớt).\n\nHãy bấm <strong>"⚡ Phát Sóng P2P"</strong>: Giao thức Gossip sẽ tự động định tuyến đường vòng qua các node còn lại để đồng thuận sổ cái mà <strong>KHÔNG HỀ BỊ SẬP HỆ THỐNG!</strong>',
      duration: 7500
    });
  } else {
    playSound('restore');
    if (btn) {
      btn.innerHTML = "📶 Tắt 2 Node (BFT)";
      btn.className = "btn btn-ghost-cyan";
    }
    updateBlockchainHud(`[P2P MESH HEALTH] All 7 peers online and synchronized.`);
    showCyberToast({
      title: 'KHÔI PHỤC TOÀN BỘ PEERS',
      type: 'success',
      message: 'Toàn bộ 7/7 Node P2P đã được kích hoạt lại và đồng bộ sổ cái.',
      duration: 4000
    });
  }
}

function openPacketInspector() {
  playSound('modal_open');
  const modal = document.getElementById('packetInspectorModal');
  if (modal) modal.style.display = 'flex';
}

function closePacketInspector() {
  playSound('modal_close');
  const modal = document.getElementById('packetInspectorModal');
  if (modal) modal.style.display = 'none';
}

function updateAndDrawP2PNetwork() {
  if (!p2pCtx) return;
  const w = p2pCanvas.width;
  const h = p2pCanvas.height;
  p2pCtx.clearRect(0, 0, w, h);

  // 1. Nền lưới cyberpunk
  drawCyberGrid(p2pCtx, w, h, 'amber');

  // 2. Cạnh Mesh liên kết P2P
  p2pEdges.forEach(([u, v]) => {
    const n1 = p2pNodes[u];
    const n2 = p2pNodes[v];
    if (n1 && n2) {
      const isEdgeOffline = isP2PPartitioned && (u === 2 || u === 4 || v === 2 || v === 4);
      if (isEdgeOffline) {
        p2pCtx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
        p2pCtx.setLineDash([2, 4]);
      } else {
        p2pCtx.strokeStyle = isChainTampered ? '#451a1a' : '#261b0f';
        p2pCtx.setLineDash([]);
      }
      p2pCtx.lineWidth = 1.5;
      p2pCtx.beginPath();
      p2pCtx.moveTo(n1.x, n1.y);
      p2pCtx.lineTo(n2.x, n2.y);
      p2pCtx.stroke();
      p2pCtx.setLineDash([]);
    }
  });

  // 3. Gói tin Gossip bay theo các đợt sóng
  for (let i = p2pPackets.length - 1; i >= 0; i--) {
    const p = p2pPackets[i];
    p.progress += p.speed;
    const curX = p.startX + (p.targetX - p.startX) * p.progress;
    const curY = p.startY + (p.targetY - p.startY) * p.progress;

    p2pCtx.fillStyle = p.color;
    p2pCtx.shadowColor = p.color;
    p2pCtx.shadowBlur = 10;
    p2pCtx.beginPath();
    p2pCtx.arc(curX, curY, 3.5, 0, Math.PI * 2);
    p2pCtx.fill();
    p2pCtx.shadowBlur = 0;

    if (p.progress >= 1) {
      p2pPackets.splice(i, 1);
    }
  }

  // 4. Vòng sóng lan truyền (Gossip wave rings)
  p2pNodes.forEach(node => {
    const isNodeOffline = isP2PPartitioned && (node.id === 2 || node.id === 4);

    if (node.pulseRadius > 0 && !isNodeOffline) {
      node.pulseRadius += 0.8;
      const alpha = Math.max(0, 1 - node.pulseRadius / 32);
      p2pCtx.strokeStyle = `rgba(245, 158, 11, ${alpha})`;
      p2pCtx.lineWidth = 1.5;
      p2pCtx.beginPath();
      p2pCtx.arc(node.x, node.y, node.pulseRadius, 0, Math.PI * 2);
      p2pCtx.stroke();
      if (node.pulseRadius > 32) node.pulseRadius = 0;
    }

    let nodeColor = isChainTampered ? '#ef4444' : '#f59e0b';
    if (node.isAlice) nodeColor = '#38bdf8';
    if (node.isBob) nodeColor = '#34d399';
    if (isNodeOffline) nodeColor = '#475569';

    p2pCtx.fillStyle = isNodeOffline ? '#080c14' : '#14110e';
    p2pCtx.strokeStyle = nodeColor;
    p2pCtx.lineWidth = 2;
    p2pCtx.beginPath();
    p2pCtx.arc(node.x, node.y, 10, 0, Math.PI * 2);
    p2pCtx.fill();
    p2pCtx.stroke();

    if (!isNodeOffline && (node.isAlice || node.isBob)) {
      p2pCtx.fillStyle = node.isAlice ? '#38bdf8' : '#34d399';
      p2pCtx.beginPath();
      p2pCtx.arc(node.x, node.y, 4, 0, Math.PI * 2);
      p2pCtx.fill();
    }

    p2pCtx.fillStyle = isNodeOffline ? '#475569' : (isChainTampered ? '#fca5a5' : '#cbd5e1');
    p2pCtx.font = '9px "JetBrains Mono"';
    p2pCtx.textAlign = 'center';
    p2pCtx.fillText(isNodeOffline ? `${node.label} [OFF]` : node.label, node.x, node.y + 20);
  });
}

function renderLoop() {
  updateAndDrawSqlNetwork();
  updateAndDrawP2PNetwork();
  requestAnimationFrame(renderLoop);
}


// ============================================================================
// 4. LOGIC TRẠNG THÁI DỮ LIỆU SQL
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

    tr.addEventListener('mouseenter', () => playSound('hover'));

    tr.innerHTML = `
      <td>0x${name}</td>
      <td><strong>${balance.toLocaleString()} ETH</strong></td>
      <td>${new Date().toLocaleTimeString()}</td>
    `;
    tbody.appendChild(tr);
  }
}

function executeSqlQuery() {
  playSound('click');
  if (isSqlServerDown) {
    playSound('alarm');
    updateSqlHud(`[TCP ERROR] connect ECONNREFUSED 192.168.1.10:5432 - Single Point of Failure (SPOF)! System HALTED.`, true);
    showCyberToast({
      title: 'LỖI MẠNG: SINGLE POINT OF FAILURE',
      type: 'danger',
      message: 'Server cơ sở dữ liệu trung tâm đã bị SẬP!\n\nMọi truy vấn UPDATE từ Client bị từ chối kết nối (<code>ECONNREFUSED</code>).\n➜ Đây là điểm yếu chí tử của mô hình Client-Server tập trung so với Blockchain P2P.',
      duration: 7000
    });
    return;
  }

  if (sqlAccounts.Alice >= 50) {
    sqlAccounts.Alice -= 50;
    sqlAccounts.Bob += 50;
  } else {
    sqlAccounts.Alice += 150;
  }
  sqlQueryCount++;
  document.getElementById('sqlMetricCounter').innerHTML = `<span class="live-dot cyan"></span> ${sqlQueryCount.toLocaleString()} QUERIES`;

  triggerSqlPacket(0);
  renderSqlTable('Alice', false);
}

function dbaTamperSql() {
  if (isSqlServerDown) {
    playSound('alarm');
    showCyberToast({
      title: 'KẾT NỐI BỊ TỪ CHỐI',
      type: 'danger',
      message: 'Máy chủ đang sập nguồn (Offline)! Ngay cả Quản trị viên (DBA) cũng không thể kết nối tới cơ sở dữ liệu.',
      duration: 5000
    });
    return;
  }
  playSound('alarm');
  sqlAccounts.Alice = 999999;
  renderSqlTable('Alice', true);
  updateSqlHud(`[DBA TAMPER] UPDATE accounts SET balance = 999999 WHERE id = 'Alice' (ACCEPTED BY ROOT)`, true);

  showCyberToast({
    title: 'SQL DBA TAMPER THÀNH CÔNG',
    type: 'danger',
    message: 'Quản trị viên (DBA) đã can thiệp trực tiếp vào máy chủ SQL:\n<code>UPDATE accounts SET balance = 999999 WHERE id = \'Alice\';</code>\n\n➜ <strong>Máy chủ trung tâm ghi đè tức thì!</strong> Không hề có bất kỳ cảnh báo mật mã nào từ mạng máy tính.',
    duration: 7500
  });
}

function toggleSqlServerCrash() {
  isSqlServerDown = !isSqlServerDown;
  const btn = document.getElementById('btnCrashSqlServer');
  if (isSqlServerDown) {
    playSound('alarm');
    if (btn) {
      btn.innerHTML = "🟢 Bật Lại Server";
      btn.className = "btn btn-cyan";
    }
    updateSqlHud(`[SPOF DISASTER] Central DB crashed! All TCP sockets closed with ECONNREFUSED.`, true);
    showCyberToast({
      title: 'SỰ CỐ MẠNG: SERVER SẬP (SPOF)',
      type: 'danger',
      message: 'Đã ngắt kết nối máy chủ cơ sở dữ liệu trung tâm (Port 5432).\n\nHãy thử bấm <strong>"▶ Thực Hiện UPDATE"</strong> để thấy toàn bộ các client bị tê liệt hoàn toàn (Single Point of Failure)!',
      duration: 7000
    });
  } else {
    playSound('restore');
    if (btn) {
      btn.innerHTML = "🔌 Sập Server (SPOF)";
      btn.className = "btn btn-ghost-danger";
    }
    updateSqlHud(`[RECOVERY] Central DB restarted on Port 5432. All client sockets reconnected.`);
    showCyberToast({
      title: 'MÁY CHỦ ĐÃ ĐƯỢC KHÔI PHỤC',
      type: 'success',
      message: 'Máy chủ cơ sở dữ liệu trung tâm đã khởi động lại trên Port 5432. Kết nối TCP của các client đã thông suốt.',
      duration: 4500
    });
  }
}


// ============================================================================
// 5. LOGIC CHUỖI KHỐI SOLIDITY (BLOCKCHAIN) & INSPECTOR MODAL
// ============================================================================
let blockchain = [];
let isChainTampered = false;
let blockCounter = 4;

async function initBlockchain() {
  blockchain = [];
  const genesisHash = await sha256("0|2026-01-01|Genesis Block|0000000000000000|0");
  blockchain.push({
    index: 0,
    timestamp: "2026-01-01T00:00:00Z",
    data: "Genesis Block",
    prevHash: "0000000000000000",
    nonce: 0,
    hash: genesisHash.slice(0, 8),
    fullHash: genesisHash,
    tampered: false
  });

  const b1Hash = await sha256(`1|2026-01-01T00:01:00Z|Deposit 500 ETH|${genesisHash}|28491`);
  blockchain.push({
    index: 1,
    timestamp: "2026-01-01T00:01:00Z",
    data: "Deposit 500 ETH",
    prevHash: genesisHash.slice(0, 8),
    prevFullHash: genesisHash,
    nonce: 28491,
    hash: b1Hash.slice(0, 8),
    fullHash: b1Hash,
    tampered: false
  });

  const b2Hash = await sha256(`2|2026-01-01T00:02:00Z|Alice->Bob: 50 ETH|${b1Hash}|94012`);
  blockchain.push({
    index: 2,
    timestamp: "2026-01-01T00:02:00Z",
    data: "Alice->Bob: 50 ETH",
    prevHash: b1Hash.slice(0, 8),
    prevFullHash: b1Hash,
    nonce: 94012,
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
    if (idx > 0) {
      const linkIcon = document.createElement('div');
      linkIcon.className = `chain-link-icon ${block.tampered ? 'broken' : ''}`;
      linkIcon.innerHTML = block.tampered ? '⚡' : '🔗';
      container.appendChild(linkIcon);
    }

    const card = document.createElement('div');
    card.className = 'block-card';
    if (idx === blockchain.length - 1 && !isChainTampered) card.classList.add('latest');
    if (block.tampered) card.classList.add('tampered');

    card.addEventListener('mouseenter', () => playSound('hover'));
    card.addEventListener('click', () => openBlockInspector(idx));

    card.innerHTML = `
      <div class="block-header">
        <span>#${block.index}</span>
        <span>${block.tampered ? 'INVALID ✗' : 'VALID ✓'}</span>
      </div>
      <div class="block-field">Tx: <span>${block.data}</span></div>
      <div class="block-field">Prev: <span>${block.prevHash}</span></div>
      <div class="block-field">Hash: <span>${block.hash}</span></div>
    `;
    container.appendChild(card);
  });
}

async function addBlockchainTransaction() {
  playSound('click');
  if (isChainTampered) {
    playSound('alarm');
    showCyberToast({
      title: 'GIAO DỊCH BỊ TỪ CHỐI',
      type: 'danger',
      message: 'Chuỗi hiện đang bị đứt gãy do phát hiện gian lận! Vui lòng bấm <strong>"🛡️ Khôi Phục Đồng Thuận"</strong> trước.',
      duration: 5000
    });
    return;
  }

  blockCounter++;
  const prevBlock = blockchain[blockchain.length - 1];
  const newIndex = blockchain.length;
  const newData = `Alice->Bob: 20 ETH`;
  const newNonce = Math.floor(Math.random() * 90000) + 10000;
  const newTimestamp = new Date().toISOString();
  const newHash = await sha256(`${newIndex}|${newTimestamp}|${newData}|${prevBlock.fullHash}|${newNonce}`);

  triggerGossipWave(0, () => {
    blockchain.push({
      index: newIndex,
      timestamp: newTimestamp,
      data: newData,
      prevHash: prevBlock.hash,
      prevFullHash: prevBlock.fullHash,
      nonce: newNonce,
      hash: newHash.slice(0, 8),
      fullHash: newHash,
      tampered: false
    });
    document.getElementById('solidityMetricCounter').innerHTML = `<span class="live-dot amber"></span> BLOCK #${String(blockCounter).padStart(2, '0')}`;
    renderBlockchainCards();
  });
}

async function toggleTamperBlockchain() {
  const btn = document.getElementById('btnTamperBlockchain');
  if (!isChainTampered) {
    playSound('alarm');
    isChainTampered = true;
    blockchain[1].data = "HACK: Alice->Bob: 9999 ETH";
    const fakeHash = await sha256(`1|HACK|${blockchain[0].fullHash}|99999`);
    blockchain[1].hash = fakeHash.slice(0, 8);
    blockchain[1].fullHash = fakeHash;
    blockchain[1].tampered = true;

    for (let i = 2; i < blockchain.length; i++) {
      blockchain[i].tampered = true;
    }

    renderBlockchainCards();
    updateBlockchainHud(`[BFT ALERT] Block #1 Tampered! PrevHash mismatch at Block #2! Chain rejected!`, true);
    if (btn) btn.innerHTML = "🛡️ Khôi Phục Đồng Thuận";

    showCyberToast({
      title: 'CẢNH BÁO: PHÁT HIỆN GIAN LẬN KHỐI (TAMPER)',
      type: 'danger',
      message: 'Hacker vừa cố tình sửa số dư tại Khối #1 thành <strong>9999 ETH</strong>.\n\n➜ Mã Hash Khối #1 thay đổi hoàn toàn ➜ Đứt gãy liên kết với Khối #2 (<code>previousHash != hash</code>)!\n➜ Toàn bộ các node P2P lập tức <strong>TỪ CHỐI</strong> chuỗi giả mạo này!',
      duration: 8500
    });
  } else {
    playSound('restore');
    isChainTampered = false;
    await initBlockchain();
    updateBlockchainHud(`[CONSENSUS RESTORED] Canonical chain synchronized across 7 peers.`);
    if (btn) btn.innerHTML = "💥 Tấn Công Sửa Khối";
    showCyberToast({
      title: 'ĐỒNG THUẬN ĐÃ ĐƯỢC KHÔI PHỤC',
      type: 'success',
      message: 'Chuỗi canonical hợp lệ đã được đồng bộ lại thành công trên toàn bộ các node ngang hàng.',
      duration: 4500
    });
  }
}


// ============================================================================
// 6. BLOCK INSPECTOR MODAL (MỔ XẺ MẬT MÃ SHA-256)
// ============================================================================
let inspectedBlockIdx = 0;

function openBlockInspector(index) {
  inspectedBlockIdx = index;
  const block = blockchain[index];
  if (!block) return;

  playSound('modal_open');
  const modal = document.getElementById('blockInspectorModal');
  if (!modal) return;

  document.getElementById('inspectIndex').innerText = `#${block.index}`;
  document.getElementById('inspectTimestamp').innerText = block.timestamp || '2026-01-01T00:00:00Z';
  document.getElementById('inspectPrevHash').innerText = block.prevFullHash || block.prevHash || '0000000000000000';
  document.getElementById('inspectNonce').innerText = block.nonce !== undefined ? block.nonce : '48201';

  const dataInput = document.getElementById('inspectDataInput');
  if (dataInput) {
    dataInput.value = block.data;
  }

  updateLiveHashDisplay();
  modal.style.display = 'flex';
}

function closeBlockInspector() {
  playSound('modal_close');
  const modal = document.getElementById('blockInspectorModal');
  if (modal) modal.style.display = 'none';
}

async function onInspectDataChange() {
  playSound('hover');
  await updateLiveHashDisplay();
}

async function updateLiveHashDisplay() {
  const block = blockchain[inspectedBlockIdx];
  if (!block) return;

  const dataInput = document.getElementById('inspectDataInput');
  const hashBox = document.getElementById('inspectHashBox');
  const hashValEl = document.getElementById('inspectHashVal');
  const statusEl = document.getElementById('inspectHashStatus');

  const currentData = dataInput ? dataInput.value : block.data;
  const payload = `${block.index}|${block.timestamp}|${currentData}|${block.prevFullHash || block.prevHash}|${block.nonce}`;
  const computedHash = await sha256(payload);

  if (hashValEl) hashValEl.innerText = computedHash;

  const isModified = currentData !== block.data;
  if (isModified) {
    if (hashBox) hashBox.classList.add('tampered');
    if (statusEl) {
      statusEl.innerHTML = `<span style="color: #ef4444;">❌ HASH BỊ THAY ĐỔI HOÀN TOÀN! Khối tiếp theo sẽ từ chối vì không khớp PreviousHash.</span>`;
    }
  } else {
    if (hashBox) hashBox.classList.remove('tampered');
    if (statusEl) {
      statusEl.innerHTML = `<span style="color: #34d399;">✓ Hash khớp hoàn hảo với bản ghi sổ cái phân tán.</span>`;
    }
  }
}


// ============================================================================
// 7. RACE SIMULATION MODE (CHẠY ĐỒNG THỜI CẢ 2 BÊN)
// ============================================================================
let isRacing = false;

function startRaceSimulation() {
  if (isRacing) return;
  isRacing = true;
  playSound('click');

  const banner = document.getElementById('raceInsightBanner');
  if (banner) banner.style.display = 'none';

  // 1. Bên SQL chạy ngay tức thì
  executeSqlQuery();

  // 2. Bên Blockchain phát sóng gossip
  addBlockchainTransaction();

  // 3. Sau khi đồng thuận P2P hoàn tất, hiện bảng tổng kết so sánh
  setTimeout(() => {
    if (banner) {
      banner.style.display = 'block';
      playSound('block_mined');
    }
    isRacing = false;
  }, 1400);
}


// ============================================================================
// 8. HOVER SYNC VÀ ACCORDION
// ============================================================================
function setupCodeHoverSync() {
  const sqlLines = document.querySelectorAll('.hover-sql');
  const blockchainLines = document.querySelectorAll('.hover-blockchain');
  const sqlPanel = document.querySelector('.card-panel.cyan-theme');
  const blockchainPanel = document.querySelector('.card-panel.amber-theme');

  sqlLines.forEach(el => {
    el.addEventListener('mouseenter', () => {
      playSound('hover');
      sqlPanel?.classList.add('active-focus');
    });
    el.addEventListener('mouseleave', () => sqlPanel?.classList.remove('active-focus'));
  });

  blockchainLines.forEach(el => {
    el.addEventListener('mouseenter', () => {
      playSound('hover');
      blockchainPanel?.classList.add('active-focus');
    });
    el.addEventListener('mouseleave', () => blockchainPanel?.classList.remove('active-focus'));
  });

  // Hover sounds cho tất cả các nút
  document.querySelectorAll('.btn, .btn-icon, .btn-race').forEach(btn => {
    btn.addEventListener('mouseenter', () => playSound('hover'));
  });
}

function toggleStudyGuide() {
  playSound('click');
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
  setupCodeHoverSync();
  renderLoop();

  window.addEventListener('resize', () => {
    initSqlNetwork();
    initP2PNetwork();
  });
});
