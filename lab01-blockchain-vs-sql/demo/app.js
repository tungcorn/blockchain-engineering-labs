/**
 * APP.JS - HIGH-DENSITY CITY NETWORK TRAVERSAL SIMULATION
 * Replicating the exact BFS vs DFS OpenStreetMap aesthetic from the reference image,
 * mapped to Blockchain P2P Gossip ("spreads in rings") vs SQL Client-Server ("commits to one direction").
 */

// ============================================================================
// 1. WEB AUDIO SYNTHESIZER (HI-TECH PROCEDURAL SFX)
// ============================================================================
let audioCtx = null;
let soundEnabled = true;

function initAudio() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) audioCtx = new AudioContext();
  }
}

const gossipScale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99];

function playSound(type, param = 0) {
  if (!soundEnabled) return;
  initAudio();
  if (!audioCtx) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const now = audioCtx.currentTime;

  if (type === 'hover') {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, now);
    gain.gain.setValueAtTime(0.015, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.015);
    osc.start(now);
    osc.stop(now + 0.015);
  } else if (type === 'click') {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(900, now);
    osc.frequency.exponentialRampToValueAtTime(450, now + 0.04);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.linearRampToValueAtTime(0.005, now + 0.04);
    osc.start(now);
    osc.stop(now + 0.04);
  } else if (type === 'tcp_rush') {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(1600, now + 0.08);
    gain.gain.setValueAtTime(0.09, now);
    gain.gain.linearRampToValueAtTime(0.005, now + 0.08);
    osc.start(now);
    osc.stop(now + 0.08);
  } else if (type === 'gossip_ripple') {
    const pitch = gossipScale[param % gossipScale.length];
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(pitch, now);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.002, now + 0.2);
    osc.start(now);
    osc.stop(now + 0.2);
  } else if (type === 'block_mined') {
    [587.33, 880.00, 1174.66].forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.04);
      gain.gain.setValueAtTime(0.09, now + i * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.002, now + 0.4);
      osc.start(now + i * 0.04);
      osc.stop(now + 0.4);
    });
  } else if (type === 'alarm') {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(540, now);
    osc.frequency.setValueAtTime(320, now + 0.08);
    osc.frequency.setValueAtTime(540, now + 0.16);
    gain.gain.setValueAtTime(0.14, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.28);
    osc.start(now);
    osc.stop(now + 0.28);
  } else if (type === 'restore') {
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);
      gain.gain.setValueAtTime(0.08, now + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.35);
      osc.start(now + idx * 0.05);
      osc.stop(now + 0.35);
    });
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

// SHA-256 helper
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}


// ============================================================================
// 2. HUD TOAST NOTIFICATION SYSTEM
// ============================================================================
function showCyberToast(options) {
  const {
    title = 'THÔNG BÁO HỆ THỐNG',
    type = 'cyan',
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

  const iconMap = { danger: '⚠️', cyan: '🌐', amber: '⚡', success: '✓' };

  toast.innerHTML = `
    <div class="toast-header">
      <div class="toast-title">
        <span>${iconMap[type] || '🔔'}</span>
        <span>${title}</span>
      </div>
      <button class="toast-close-btn">&times;</button>
    </div>
    <div class="toast-body">${message}</div>
    <div class="toast-footer">
      <button class="toast-action-btn">Đã hiểu ✓</button>
    </div>
    <div class="toast-progress-bar"></div>
  `;

  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));

  const closeToast = () => {
    toast.classList.remove('show');
    toast.classList.add('hide');
    setTimeout(() => {
      if (toast.parentElement) toast.parentElement.removeChild(toast);
    }, 300);
  };

  toast.querySelector('.toast-close-btn').addEventListener('click', () => { playSound('click'); closeToast(); });
  toast.querySelector('.toast-action-btn').addEventListener('click', () => { playSound('click'); closeToast(); });

  if (duration > 0) {
    const progressBar = toast.querySelector('.toast-progress-bar');
    if (progressBar) {
      progressBar.style.transition = `width ${duration}ms linear`;
      requestAnimationFrame(() => progressBar.style.width = '0%');
    }
    setTimeout(closeToast, duration);
  }
}


// ============================================================================
// 3. PROCEDURAL CITY ROAD NETWORK (AUTHENTIC OSM-STYLE GRAPH GENERATOR)
// ============================================================================
let cityNodes = [];
let cityEdges = [];
let startNodeId = 0;
let goalNodeId = 0;
let centralServerNodeId = 0;
let directSqlPath = [];

function generateCityNetwork(width, height) {
  cityNodes = [];
  cityEdges = [];

  const cx = width / 2;
  const cy = height / 2;

  // 1. Tạo các trục đường chính và lưới phố đô thị Manhattan - Brooklyn
  const cols = 9;
  const rows = 14;
  const paddingX = width * 0.12;
  const paddingY = height * 0.12;
  const stepX = (width - paddingX * 2) / (cols - 1);
  const stepY = (height - paddingY * 2) / (rows - 1);

  let id = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // Làm cong nhẹ mạng lưới theo hình dáng dải đất Manhattan
      const curvature = Math.sin((r / rows) * Math.PI) * (width * 0.08);
      const jitterX = ((c % 2) - 0.5) * (stepX * 0.25);
      const jitterY = ((r % 2) - 0.5) * (stepY * 0.25);

      const x = paddingX + c * stepX + curvature + jitterX;
      const y = paddingY + r * stepY + jitterY;

      cityNodes.push({
        id: id++,
        c,
        r,
        x,
        y,
        exploredBfs: false,
        exploredDfs: false,
        bfsWaveDist: 0,
        bfsRingPulse: 0
      });
    }
  }

  // 2. Tạo các cạnh đường (Avenues, Streets và các đường chéo cao tốc)
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cur = r * cols + c;

      // Cạnh ngang (Cross streets)
      if (c < cols - 1) {
        cityEdges.push({ u: cur, v: cur + 1, litCyan: 0, litAmber: 0, inShortestPath: false });
      }
      // Cạnh dọc (Avenues)
      if (r < rows - 1) {
        cityEdges.push({ u: cur, v: cur + cols, litCyan: 0, litAmber: 0, inShortestPath: false });
      }
      // Các đường nối chéo kiểu Broadway
      if (r < rows - 1 && c < cols - 1 && (r + c) % 3 === 0) {
        cityEdges.push({ u: cur, v: cur + cols + 1, litCyan: 0, litAmber: 0, inShortestPath: false });
      }
      if (r < rows - 1 && c > 0 && (r + c) % 4 === 0) {
        cityEdges.push({ u: cur, v: cur + cols - 1, litCyan: 0, litAmber: 0, inShortestPath: false });
      }
    }
  }

  // Điểm A: Times Square (Alice) ở gần đỉnh trung tâm
  startNodeId = 1 * cols + Math.floor(cols / 2);
  // Điểm B: Coney Island (Bob) ở gần đáy trung tâm
  goalNodeId = (rows - 2) * cols + Math.floor(cols / 2);
  // Máy chủ trung tâm SQL (Central Server Core)
  centralServerNodeId = Math.floor(rows / 2) * cols + Math.floor(cols / 2);

  // Tính sẵn tuyến đường trực tiếp SQL từ Alice -> Central DB -> Bob
  directSqlPath = [];
  let curr = startNodeId;
  directSqlPath.push(curr);
  while (curr !== centralServerNodeId) {
    const curR = Math.floor(curr / cols);
    const targetR = Math.floor(centralServerNodeId / cols);
    if (curR < targetR) curr += cols;
    else if (curr < centralServerNodeId) curr += 1;
    else if (curr > centralServerNodeId) curr -= 1;
    directSqlPath.push(curr);
  }
  while (curr !== goalNodeId) {
    const curR = Math.floor(curr / cols);
    const targetR = Math.floor(goalNodeId / cols);
    if (curR < targetR) curr += cols;
    else if (curr < goalNodeId) curr += 1;
    else if (curr > goalNodeId) curr -= 1;
    directSqlPath.push(curr);
  }
}


// ============================================================================
// 4. ANIMATION STATES & SIMULATION ENGINES
// ============================================================================
let isSqlServerDown = false;
let isChainTampered = false;
let isP2PPartitioned = false;

// SQL Animation Variables
let sqlPacketProgress = 0;
let isSqlRunning = false;
let sqlLaserPulse = 0;

// Blockchain Animation Variables
let isBfsRunning = false;
let bfsWaveRadius = 0;
let bfsMaxRadius = 500;
let bfsActiveRings = [];
let blockchainShortestPath = [];

function resetVisualStates() {
  cityEdges.forEach(edge => {
    edge.litCyan = 0;
    edge.litAmber = 0;
    edge.inShortestPath = false;
  });
  cityNodes.forEach(node => {
    node.exploredBfs = false;
    node.exploredDfs = false;
    node.bfsRingPulse = 0;
  });
  bfsActiveRings = [];
}

// ============================================================================
// 5. RUN SQL DIRECT COMMIT (COMMITS TO ONE DIRECTION)
// ============================================================================
function executeSqlQuery() {
  playSound('click');
  if (isSqlServerDown) {
    playSound('alarm');
    updateSqlHud(`[TCP ERROR] connect ECONNREFUSED 192.168.1.10:5432 - Single Point of Failure (SPOF)!`, true);
    showCyberToast({
      title: 'LỖI MẠNG: SINGLE POINT OF FAILURE',
      type: 'danger',
      message: 'Server cơ sở dữ liệu trung tâm đã bị SẬP!\nClient không thể kết nối (<code>ECONNREFUSED</code>). Toàn bộ hệ thống bị tê liệt hoàn toàn.',
      duration: 6000
    });
    return;
  }

  isSqlRunning = true;
  sqlPacketProgress = 0;
  playSound('tcp_rush');
  updateSqlHud(`[TCP Port 5432] Direct stream: Times Square ➜ Central DB Core ➜ Coney Island`);

  const duration = 450;
  const startTime = performance.now();

  function animateSql(now) {
    const elapsed = now - startTime;
    sqlPacketProgress = Math.min(1, elapsed / duration);

    // Thắp sáng các cạnh trên tuyến đường trực tiếp
    const activeIdx = Math.floor(sqlPacketProgress * (directSqlPath.length - 1));
    for (let i = 0; i <= activeIdx; i++) {
      const u = directSqlPath[i];
      const v = directSqlPath[i + 1];
      if (v !== undefined) {
        cityEdges.forEach(e => {
          if ((e.u === u && e.v === v) || (e.u === v && e.v === u)) {
            e.litCyan = 1;
          }
        });
      }
    }

    if (sqlPacketProgress < 1) {
      requestAnimationFrame(animateSql);
    } else {
      isSqlRunning = false;
      sqlLaserPulse = 1;
      updateSqlHud(`[COMMITTED] 1 Query applied directly in 0.82ms. Balance updated.`);
      updateResultsTable('sql', '0.82 ms', '1 Central Core', 'MUTABLE (In-place Overwrite)');
    }
  }

  requestAnimationFrame(animateSql);
}

function dbaTamperSql() {
  if (isSqlServerDown) {
    playSound('alarm');
    showCyberToast({
      title: 'KẾT NỐI BỊ TỪ CHỐI',
      type: 'danger',
      message: 'Máy chủ đang sập nguồn. Ngay cả DBA cũng không thể kết nối.',
      duration: 4000
    });
    return;
  }
  playSound('alarm');
  updateSqlHud(`[DBA TAMPER] UPDATE accounts SET balance = 999999 WHERE id = 'Alice' (ACCEPTED BY ROOT)`, true);
  sqlLaserPulse = 2; // Glitch effect
  showCyberToast({
    title: 'SQL DBA TAMPER THÀNH CÔNG',
    type: 'danger',
    message: 'Quản trị viên (DBA) vừa can thiệp vào ô nhớ máy chủ:\n<code>UPDATE accounts SET balance = 999999;</code>\n\n➜ Dữ liệu bị ghi đè tức thì trong im lặng mà không có bất kỳ còi báo động mật mã nào!',
    duration: 7500
  });
  updateResultsTable('sql', '0.82 ms', '1 Central Core', 'TAMPERED (Silently Overwritten!)');
}

function toggleSqlServerCrash() {
  isSqlServerDown = !isSqlServerDown;
  const btn = document.getElementById('btnCrashSqlServer');
  if (isSqlServerDown) {
    playSound('alarm');
    if (btn) {
      btn.innerHTML = "🟢 Bật Lại Server";
      btn.className = "btn-action cyan";
    }
    updateSqlHud(`[SPOF CRASH] Central DB crashed! All TCP sockets closed with ECONNREFUSED.`, true);
    showCyberToast({
      title: 'SỰ CỐ MẠNG: SERVER SẬP (SPOF)',
      type: 'danger',
      message: 'Máy chủ DB trung tâm đã bị ngắt kết nối.\nBấm "▶ SQL Direct Commit" để thấy toàn bộ client bị tê liệt hoàn toàn (Single Point of Failure)!',
      duration: 6500
    });
    updateResultsTable('sql', 'TIMEOUT', '0 (OFFLINE)', 'SYSTEM HALTED (SPOF)');
  } else {
    playSound('restore');
    if (btn) {
      btn.innerHTML = "🔌 Sập Server (SPOF)";
      btn.className = "btn-action ghost";
    }
    updateSqlHud(`[RECOVERY] Central DB restarted on Port 5432. All client sockets reconnected.`);
    showCyberToast({
      title: 'MÁY CHỦ ĐÃ KHÔI PHỤC',
      type: 'success',
      message: 'Máy chủ SQL trung tâm đã sẵn sàng tiếp nhận truy vấn trở lại.',
      duration: 4000
    });
    updateResultsTable('sql', '0.82 ms', '1 Central Core', 'MUTABLE (In-place Overwrite)');
  }
}


// ============================================================================
// 6. RUN BLOCKCHAIN P2P GOSSIP WAVE ("SPREADS IN RINGS")
// ============================================================================
function addBlockchainTransaction() {
  playSound('click');
  if (isChainTampered) {
    playSound('alarm');
    showCyberToast({
      title: 'GIAO DỊCH BỊ TỪ CHỐI',
      type: 'danger',
      message: 'Chuỗi đang bị đứt gãy do phát hiện gian lận! Hãy bấm <strong>"Khôi Phục Đồng Thuận"</strong> trước.',
      duration: 5000
    });
    return;
  }

  isBfsRunning = true;
  bfsWaveRadius = 0;
  resetVisualStates();
  updateBlockchainHud(`[P2P GOSSIP] Alice broadcasts signed Tx (secp256k1). SPREADS IN CONCENTRIC RINGS...`);

  const startNode = cityNodes[startNodeId];
  const goalNode = cityNodes[goalNodeId];
  if (!startNode || !goalNode) return;

  // Tính khoảng cách tối đa từ Start tới Goal
  bfsMaxRadius = Math.hypot(goalNode.x - startNode.x, goalNode.y - startNode.y) * 1.15;

  let hop = 0;
  const startTime = performance.now();
  const waveDuration = 1350; // ~1.35 giây mô phỏng độ trễ P2P thực tế

  function animateGossipWave(now) {
    const elapsed = now - startTime;
    const progress = Math.min(1, elapsed / waveDuration);
    bfsWaveRadius = progress * bfsMaxRadius;

    // Phát âm thanh hợp âm Gossip theo từng đợt sóng lan truyền
    const currentHop = Math.floor(progress * 8);
    if (currentHop !== hop) {
      hop = currentHop;
      playSound('gossip_ripple', hop);
    }

    // Thắp sáng các cạnh và node nằm trong bán kính sóng lan truyền
    cityNodes.forEach(node => {
      // Bỏ qua các node bị rớt nếu đang test BFT
      if (isP2PPartitioned && (node.id % 3 === 0)) return;

      const d = Math.hypot(node.x - startNode.x, node.y - startNode.y);
      if (d <= bfsWaveRadius && !node.exploredBfs) {
        node.exploredBfs = true;
        node.bfsRingPulse = 1;
      }
    });

    cityEdges.forEach(e => {
      const n1 = cityNodes[e.u];
      const n2 = cityNodes[e.v];
      if (n1 && n2) {
        if (n1.exploredBfs || n2.exploredBfs) {
          e.litAmber = Math.max(e.litAmber, 1 - (Math.abs(Math.hypot(n1.x - startNode.x, n1.y - startNode.y) - bfsWaveRadius) / 120));
        }
      }
    });

    if (progress < 1) {
      requestAnimationFrame(animateGossipWave);
    } else {
      isBfsRunning = false;
      playSound('block_mined');
      
      // Đánh dấu đường đi đồng thuận được xác thực (Shortest Validated Path)
      directSqlPath.forEach((u, i) => {
        const v = directSqlPath[i + 1];
        if (v !== undefined) {
          cityEdges.forEach(e => {
            if ((e.u === u && e.v === v) || (e.u === v && e.v === u)) {
              e.inShortestPath = true;
            }
          });
        }
      });

      if (isP2PPartitioned) {
        updateBlockchainHud(`[BFT CONSENSUS] 30% peers offline, but Gossip wave rerouted to 10,201 active peers. Mined!`);
        updateResultsTable('chain', '1,420 ms', '10,201 Peers (BFT Survives)', 'IMMUTABLE ✓ (SHA-256)');
      } else {
        updateBlockchainHud(`[CONSENSUS REACHED] 14,574 Peers verified ECDSA signature. Block appended.`);
        updateResultsTable('chain', '1,420 ms', '14,574 Peers', 'IMMUTABLE ✓ (SHA-256)');
      }
    }
  }

  requestAnimationFrame(animateGossipWave);
}

function toggleTamperBlockchain() {
  const btn = document.getElementById('btnTamperBlockchain');
  if (!isChainTampered) {
    playSound('alarm');
    isChainTampered = true;
    updateBlockchainHud(`[BFT SECURITY ALERT] Block #1 Tampered! PrevHash mismatch at Block #2! Chain rejected!`, true);
    if (btn) btn.innerHTML = "🛡️ Khôi Phục Đồng Thuận";
    showCyberToast({
      title: 'CẢNH BÁO: PHÁT HIỆN GIAN LẬN KHỐI (TAMPER)',
      type: 'danger',
      message: 'Hacker vừa cố tình sửa số dư tại Khối #1 thành 9999 ETH.\n\n➜ Mã băm thay đổi ➜ Không khớp PreviousHash của Khối #2!\n➜ Toàn bộ các node P2P lập tức <strong>TỪ CHỐI</strong> chuỗi giả mạo này!',
      duration: 8500
    });
    updateResultsTable('chain', 'REJECTED', '14,574 Peers', 'INVALID CHAIN (Tamper Detected!)');
  } else {
    playSound('restore');
    isChainTampered = false;
    updateBlockchainHud(`[CANONICAL RESTORED] Canonical chain synchronized across 14,574 peers.`);
    if (btn) btn.innerHTML = "💥 Tấn Công Sửa Khối";
    showCyberToast({
      title: 'ĐỒNG THUẬN ĐÃ KHÔI PHỤC',
      type: 'success',
      message: 'Chuỗi khối hợp lệ đã được đồng bộ lại thành công trên toàn bộ mạng lưới.',
      duration: 4000
    });
    updateResultsTable('chain', '1,420 ms', '14,574 Peers', 'IMMUTABLE ✓ (SHA-256)');
  }
}

function toggleP2PPartition() {
  isP2PPartitioned = !isP2PPartitioned;
  const btn = document.getElementById('btnPartitionP2P');
  if (isP2PPartitioned) {
    playSound('alarm');
    if (btn) {
      btn.innerHTML = "🟢 Bật Lại 100% Node";
      btn.className = "btn-action amber";
    }
    updateBlockchainHud(`[BFT TEST] 30% of network nodes disconnected. Testing Gossip Mesh rerouting...`, true);
    showCyberToast({
      title: 'MẠNG P2P: CHỊU LỖI BYZANTINE (BFT)',
      type: 'amber',
      message: 'Đã ngắt kết nối ngẫu nhiên 30% node trong toàn bộ đô thị.\n\nHãy bấm "⚡ Phát Sóng P2P": Sóng Gossip vẫn tự tìm đường vòng qua các node sống sót để đạt đồng thuận sổ cái mà <strong>KHÔNG HỀ BỊ SẬP HỆ THỐNG!</strong>',
      duration: 7500
    });
  } else {
    playSound('restore');
    if (btn) {
      btn.innerHTML = "📶 Tắt 30% Node (BFT)";
      btn.className = "btn-action ghost";
    }
    updateBlockchainHud(`[MESH HEALTH] 100% peer nodes online and synchronized.`);
    showCyberToast({
      title: 'KHÔI PHỤC TOÀN MẠNG',
      type: 'success',
      message: 'Toàn bộ 14,574 node P2P đã được bật lại và đồng bộ.',
      duration: 4000
    });
  }
}

function startRaceSimulation() {
  playSound('click');
  resetVisualStates();
  executeSqlQuery();
  addBlockchainTransaction();
}


// ============================================================================
// 7. CANVAS RENDERING ENGINE (AUTHENTIC GLOWING CITY NETWORK)
// ============================================================================
const sqlCanvas = document.getElementById('sqlNetworkCanvas');
const sqlCtx = sqlCanvas ? sqlCanvas.getContext('2d') : null;

const p2pCanvas = document.getElementById('p2pNetworkCanvas');
const p2pCtx = p2pCanvas ? p2pCanvas.getContext('2d') : null;

function resizeCanvases() {
  if (sqlCanvas && sqlCanvas.parentElement) {
    const r = sqlCanvas.parentElement.getBoundingClientRect();
    sqlCanvas.width = r.width;
    sqlCanvas.height = 460;
  }
  if (p2pCanvas && p2pCanvas.parentElement) {
    const r = p2pCanvas.parentElement.getBoundingClientRect();
    p2pCanvas.width = r.width;
    p2pCanvas.height = 460;
  }
  if (sqlCanvas) {
    generateCityNetwork(sqlCanvas.width, sqlCanvas.height);
  }
}

// Vẽ bản đồ SQL (Mô hình Client-Server trực tiếp)
function renderSqlMap() {
  if (!sqlCtx || !sqlCanvas) return;
  const w = sqlCanvas.width;
  const h = sqlCanvas.height;
  sqlCtx.clearRect(0, 0, w, h);

  // 1. Nền bản đồ đô thị tối
  sqlCtx.fillStyle = '#05080f';
  sqlCtx.fillRect(0, 0, w, h);

  // 2. Vẽ tất cả các cạnh đường nền mờ
  cityEdges.forEach(e => {
    const n1 = cityNodes[e.u];
    const n2 = cityNodes[e.v];
    if (!n1 || !n2) return;

    sqlCtx.beginPath();
    sqlCtx.moveTo(n1.x, n1.y);
    sqlCtx.lineTo(n2.x, n2.y);

    if (e.litCyan > 0) {
      // Tuyến đường TCP đang truyền tín hiệu
      sqlCtx.strokeStyle = isSqlServerDown ? '#ef4444' : '#00f0ff';
      sqlCtx.lineWidth = 2.5;
      sqlCtx.shadowColor = isSqlServerDown ? '#ef4444' : '#00f0ff';
      sqlCtx.shadowBlur = 12;
      sqlCtx.stroke();
      sqlCtx.shadowBlur = 0;
      e.litCyan = Math.max(0, e.litCyan - 0.015);
    } else {
      // Đường phố nền mờ phong cách OpenStreetMap đêm
      sqlCtx.strokeStyle = 'rgba(0, 240, 255, 0.07)';
      sqlCtx.lineWidth = 1;
      sqlCtx.stroke();
    }
  });

  // 3. Vẽ các giao lộ / Node mạng
  cityNodes.forEach(n => {
    sqlCtx.beginPath();
    sqlCtx.arc(n.x, n.y, 1.5, 0, Math.PI * 2);
    sqlCtx.fillStyle = 'rgba(0, 240, 255, 0.2)';
    sqlCtx.fill();
  });

  // 4. Vẽ máy chủ trung tâm Central DB Tower ở giữa bản đồ
  const serverNode = cityNodes[centralServerNodeId];
  if (serverNode) {
    sqlCtx.save();
    sqlCtx.beginPath();
    sqlCtx.arc(serverNode.x, serverNode.y, 14, 0, Math.PI * 2);

    if (!isSqlServerDown) {
      sqlCtx.fillStyle = '#0284c7';
      sqlCtx.shadowColor = '#00f0ff';
      sqlCtx.shadowBlur = 18;
      sqlCtx.fill();
      sqlCtx.strokeStyle = '#00f0ff';
      sqlCtx.lineWidth = 2;
      sqlCtx.stroke();

      // Radar sweep nhẹ quanh Server
      sqlCtx.beginPath();
      sqlCtx.arc(serverNode.x, serverNode.y, 24 + Math.sin(Date.now() / 300) * 4, 0, Math.PI * 2);
      sqlCtx.strokeStyle = 'rgba(0, 240, 255, 0.25)';
      sqlCtx.lineWidth = 1;
      sqlCtx.stroke();
    } else {
      // Máy chủ sập nguồn (SPOF)
      sqlCtx.fillStyle = '#7f1d1d';
      sqlCtx.shadowColor = '#ef4444';
      sqlCtx.shadowBlur = 24;
      sqlCtx.fill();
      sqlCtx.strokeStyle = '#ef4444';
      sqlCtx.lineWidth = 2;
      sqlCtx.stroke();

      sqlCtx.fillStyle = '#ffffff';
      sqlCtx.font = 'bold 11px monospace';
      sqlCtx.textAlign = 'center';
      sqlCtx.fillText('✕', serverNode.x, serverNode.y + 4);
    }
    sqlCtx.restore();
  }
}

// Vẽ bản đồ Blockchain (Mô hình P2P Gossip Wave - Spreads in rings)
function renderP2PMap() {
  if (!p2pCtx || !p2pCanvas) return;
  const w = p2pCanvas.width;
  const h = p2pCanvas.height;
  p2pCtx.clearRect(0, 0, w, h);

  // 1. Nền bản đồ đô thị tối
  p2pCtx.fillStyle = '#06070a';
  p2pCtx.fillRect(0, 0, w, h);

  const startNode = cityNodes[startNodeId];

  // 2. Vẽ vòng sóng Gossip lan truyền từ Times Square (Alice)
  if (isBfsRunning && startNode) {
    p2pCtx.save();
    for (let i = 0; i < 3; i++) {
      const ringR = bfsWaveRadius - i * 45;
      if (ringR > 0) {
        p2pCtx.beginPath();
        p2pCtx.arc(startNode.x, startNode.y, ringR, 0, Math.PI * 2);
        p2pCtx.strokeStyle = `rgba(245, 158, 11, ${Math.max(0, 0.45 - i * 0.14)})`;
        p2pCtx.lineWidth = 2.5;
        p2pCtx.stroke();
      }
    }
    p2pCtx.restore();
  }

  // 3. Vẽ tất cả các cạnh đường
  cityEdges.forEach(e => {
    const n1 = cityNodes[e.u];
    const n2 = cityNodes[e.v];
    if (!n1 || !n2) return;

    p2pCtx.beginPath();
    p2pCtx.moveTo(n1.x, n1.y);
    p2pCtx.lineTo(n2.x, n2.y);

    if (e.inShortestPath && !isChainTampered) {
      // Đường đi đồng thuận được xác thực (Vàng ánh kim rực rỡ)
      p2pCtx.strokeStyle = '#fbbf24';
      p2pCtx.lineWidth = 3;
      p2pCtx.shadowColor = '#f59e0b';
      p2pCtx.shadowBlur = 14;
      p2pCtx.stroke();
      p2pCtx.shadowBlur = 0;
    } else if (e.litAmber > 0) {
      // Sóng Gossip đang quét qua đường phố
      p2pCtx.strokeStyle = isChainTampered ? '#ef4444' : `rgba(245, 158, 11, ${e.litAmber})`;
      p2pCtx.lineWidth = 2;
      p2pCtx.stroke();
      e.litAmber = Math.max(0, e.litAmber - 0.012);
    } else {
      // Đường phố nền mờ P2P
      p2pCtx.strokeStyle = isChainTampered ? 'rgba(239, 68, 68, 0.12)' : 'rgba(245, 158, 11, 0.08)';
      p2pCtx.lineWidth = 1;
      p2pCtx.stroke();
    }
  });

  // 4. Vẽ các node mạng (và hiển thị node offline nếu test BFT)
  cityNodes.forEach(n => {
    const isOffline = isP2PPartitioned && (n.id % 3 === 0);

    p2pCtx.beginPath();
    p2pCtx.arc(n.x, n.y, isOffline ? 2 : (n.exploredBfs ? 3 : 1.5), 0, Math.PI * 2);

    if (isOffline) {
      p2pCtx.fillStyle = 'rgba(71, 85, 105, 0.5)';
    } else if (isChainTampered) {
      p2pCtx.fillStyle = '#ef4444';
    } else if (n.exploredBfs) {
      p2pCtx.fillStyle = '#fbbf24';
    } else {
      p2pCtx.fillStyle = 'rgba(245, 158, 11, 0.25)';
    }
    p2pCtx.fill();
  });
}

function mainRenderLoop() {
  renderSqlMap();
  renderP2PMap();
  requestAnimationFrame(mainRenderLoop);
}


// ============================================================================
// 8. DATA STATE (LEDGER & TABLE UPDATES)
// ============================================================================
let sqlAccounts = { Alice: 500, Bob: 200, Charlie: 100 };
let blockchain = [];
let queryCount = 15773;

function renderSqlTable() {
  const tbody = document.getElementById('sqlTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  for (const [name, balance] of Object.entries(sqlAccounts)) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>0x${name}</td>
      <td><strong>${balance.toLocaleString()} ETH</strong></td>
      <td>${new Date().toLocaleTimeString()}</td>
    `;
    tbody.appendChild(tr);
  }
}

async function initBlockchainLedger() {
  blockchain = [];
  const gHash = await sha256("0|Genesis|00000000|0");
  blockchain.push({ index: 0, data: "Genesis Block", hash: gHash.slice(0, 8), fullHash: gHash, prevHash: "00000000" });

  const b1Hash = await sha256(`1|Deposit 500 ETH|${gHash}|28491`);
  blockchain.push({ index: 1, data: "Deposit 500 ETH", hash: b1Hash.slice(0, 8), fullHash: b1Hash, prevHash: gHash.slice(0, 8) });

  const b2Hash = await sha256(`2|Alice->Bob 50 ETH|${b1Hash}|94012`);
  blockchain.push({ index: 2, data: "Alice->Bob 50 ETH", hash: b2Hash.slice(0, 8), fullHash: b2Hash, prevHash: b1Hash.slice(0, 8) });

  renderBlockCards();
}

function renderBlockCards() {
  const container = document.getElementById('blockchainBlocks');
  if (!container) return;
  container.innerHTML = '';

  blockchain.forEach((b, idx) => {
    if (idx > 0) {
      const link = document.createElement('div');
      link.className = `chain-link-icon ${isChainTampered ? 'broken' : ''}`;
      link.innerText = isChainTampered ? '⚡' : '🔗';
      container.appendChild(link);
    }
    const card = document.createElement('div');
    card.className = `block-card ${isChainTampered ? 'tampered' : ''}`;
    card.onclick = () => openBlockInspector(idx);
    card.innerHTML = `
      <div class="block-header">
        <span>#${b.index}</span>
        <span>${isChainTampered ? 'INVALID ✗' : 'VALID ✓'}</span>
      </div>
      <div class="block-field">Tx: <span>${b.data}</span></div>
      <div class="block-field">Prev: <span>${b.prevHash}</span></div>
      <div class="block-field">Hash: <span>${b.hash}</span></div>
    `;
    container.appendChild(card);
  });
}

function updateResultsTable(arch, latency, nodes, integrity) {
  if (arch === 'sql') {
    const lat = document.getElementById('tableResLatencySql');
    const nod = document.getElementById('tableResNodesSql');
    const int = document.getElementById('tableResIntegritySql');
    if (lat) lat.innerText = latency;
    if (nod) nod.innerText = nodes;
    if (int) int.innerText = integrity;
  } else {
    const lat = document.getElementById('tableResLatencyChain');
    const nod = document.getElementById('tableResNodesChain');
    const int = document.getElementById('tableResIntegrityChain');
    if (lat) lat.innerText = latency;
    if (nod) nod.innerText = nodes;
    if (int) int.innerText = integrity;
  }
}

function updateSqlHud(msg, isAlert = false) {
  const hud = document.getElementById('sqlHud');
  if (!hud) return;
  hud.className = `network-hud cyan ${isAlert ? 'alert' : ''}`;
  hud.innerHTML = `<span class="hud-prompt">&gt;</span> <span class="hud-log">${msg}</span>`;
}

function updateBlockchainHud(msg, isAlert = false) {
  const hud = document.getElementById('blockchainHud');
  if (!hud) return;
  hud.className = `network-hud amber ${isAlert ? 'alert' : ''}`;
  hud.innerHTML = `<span class="hud-prompt">&gt;</span> <span class="hud-log">${msg}</span>`;
}

function switchTab(tabId) {
  playSound('click');
  document.querySelectorAll('.drawer-tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.drawer-content').forEach(c => c.classList.remove('active'));

  event.target.classList.add('active');
  const target = document.getElementById(`tab-${tabId}`);
  if (target) target.classList.add('active');
}


// ============================================================================
// 9. MODALS (BLOCK INSPECTOR & WIRESHARK SNIFFER)
// ============================================================================
let inspectedIdx = 1;

function openBlockInspector(idx = 1) {
  inspectedIdx = idx;
  const b = blockchain[idx] || blockchain[1];
  if (!b) return;

  playSound('click');
  const modal = document.getElementById('blockInspectorModal');
  if (!modal) return;

  document.getElementById('inspectIndex').innerText = `#${b.index}`;
  document.getElementById('inspectTimestamp').innerText = new Date().toISOString();
  document.getElementById('inspectPrevHash').innerText = b.prevHash;
  document.getElementById('inspectNonce').innerText = '48201';

  const dataInput = document.getElementById('inspectDataInput');
  if (dataInput) dataInput.value = b.data;

  updateLiveHashDisplay();
  modal.style.display = 'flex';
}

function closeBlockInspector() {
  playSound('click');
  const modal = document.getElementById('blockInspectorModal');
  if (modal) modal.style.display = 'none';
}

async function onInspectDataChange() {
  playSound('hover');
  await updateLiveHashDisplay();
}

async function updateLiveHashDisplay() {
  const b = blockchain[inspectedIdx];
  if (!b) return;

  const dataInput = document.getElementById('inspectDataInput');
  const hashBox = document.getElementById('inspectHashBox');
  const hashValEl = document.getElementById('inspectHashVal');
  const statusEl = document.getElementById('inspectHashStatus');

  const curData = dataInput ? dataInput.value : b.data;
  const newHash = await sha256(`${b.index}|${curData}|${b.prevHash}|48201`);

  if (hashValEl) hashValEl.innerText = newHash;

  const modified = curData !== b.data;
  if (modified) {
    if (hashBox) hashBox.classList.add('tampered');
    if (statusEl) statusEl.innerHTML = `<span style="color: #ef4444;">❌ HASH BỊ THAY ĐỔI HOÀN TOÀN! Khối kế tiếp sẽ từ chối vì PreviousHash sai lệch.</span>`;
  } else {
    if (hashBox) hashBox.classList.remove('tampered');
    if (statusEl) statusEl.innerHTML = `<span style="color: #34d399;">✓ Khớp hoàn toàn với bản ghi sổ cái phân tán.</span>`;
  }
}

function openPacketInspector() {
  playSound('click');
  const modal = document.getElementById('packetInspectorModal');
  if (modal) modal.style.display = 'flex';
}

function closePacketInspector() {
  playSound('click');
  const modal = document.getElementById('packetInspectorModal');
  if (modal) modal.style.display = 'none';
}


// ============================================================================
// KHỞI ĐỘNG HỆ THỐNG
// ============================================================================
window.addEventListener('load', async () => {
  resizeCanvases();
  renderSqlTable();
  await initBlockchainLedger();
  mainRenderLoop();

  window.addEventListener('resize', () => {
    resizeCanvases();
  });
});
