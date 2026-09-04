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
    title = 'SYSTEM NOTIFICATION',
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
      <button class="toast-action-btn">Understood ✓</button>
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
// 3. COMPUTER NETWORK TOPOLOGY ENGINE (STAR TOPOLOGY vs P2P MESH)
// ============================================================================

// --- SQL STAR TOPOLOGY (CLIENT-SERVER ARCHITECTURE) ---
const sqlServer = {
  x: 0, y: 0, w: 130, h: 70,
  name: "CENTRAL DATABASE CORE",
  type: "PostgreSQL / MySQL",
  port: 5432,
  ip: "192.168.1.10",
  pulseGlow: 0,
  memoryActivity: 0,
  fanAngle: 0
};

let sqlClients = [];
let sqlCables = [];
let sqlPackets = [];
let sqlSparks = [];

// --- BLOCKCHAIN P2P MESH (DECENTRALIZED ARCHITECTURE) ---
let p2pNodes = [];
let p2pLinks = [];
let p2pGossipPackets = [];
let p2pWavefronts = [];

// Network States
let isSqlServerDown = false;
let isChainTampered = false;
let isP2PPartitioned = false;

// SQL Simulation State
let isSqlRunning = false;

// Blockchain Simulation State
let isGossipRunning = false;

// Initialize network topologies
function initNetworkTopologies(width, height) {
  const cx = width / 2;
  const cy = height / 2;

  // 1. Configure SQL Star Topology
  sqlServer.x = cx;
  sqlServer.y = cy;

  sqlClients = [
    { id: 'alice', name: 'Client Alice', ip: '192.168.1.15', port: 52341, x: cx, y: height * 0.14, role: 'client', icon: '💻', pulse: 0 },
    { id: 'bob', name: 'Client Bob', ip: '192.168.1.20', port: 41290, x: cx, y: height * 0.86, role: 'client', icon: '💻', pulse: 0 },
    { id: 'gateway', name: 'Web API Gateway', ip: '192.168.1.12', port: 8080, x: width * 0.16, y: height * 0.32, role: 'gateway', icon: '🌐', pulse: 0 },
    { id: 'mobile', name: 'Mobile App Node', ip: '192.168.1.33', port: 3000, x: width * 0.84, y: height * 0.32, role: 'client', icon: '📱', pulse: 0 },
    { id: 'worker', name: 'Worker Service', ip: '192.168.1.45', port: 9092, x: width * 0.16, y: height * 0.68, role: 'worker', icon: '⚙️', pulse: 0 },
    { id: 'analytics', name: 'Analytics DB Node', ip: '192.168.1.72', port: 8123, x: width * 0.84, y: height * 0.68, role: 'worker', icon: '📊', pulse: 0 },
    { id: 'dba', name: 'DBA Root Terminal', ip: '192.168.1.99', port: 22, x: width * 0.80, y: height * 0.14, role: 'dba', icon: '🔑', pulse: 0 }
  ];

  sqlCables = sqlClients.map(c => ({
    client: c,
    activity: 0,
    heartbeatOffset: Math.random() * 100
  }));

  // 2. Configure Blockchain P2P Mesh Topology
  p2pNodes = [
    // Endpoint A: Alice
    { id: 'alice', name: 'Node Alice', peerId: '0x71c', x: cx, y: height * 0.14, role: 'full', isOffline: false, litGlow: 0, icon: 'A' },
    // Endpoint B: Bob
    { id: 'bob', name: 'Node Bob', peerId: '0x94f', x: cx, y: height * 0.86, role: 'full', isOffline: false, litGlow: 0, icon: 'B' },

    // Validator Cluster (Proof-of-Stake Quorum)
    { id: 'val1', name: 'Validator #1', peerId: 'PoS-1', x: cx - 42, y: height * 0.49, role: 'validator', isOffline: false, litGlow: 0 },
    { id: 'val2', name: 'Validator #2', peerId: 'PoS-2', x: cx, y: height * 0.46, role: 'validator', isOffline: false, litGlow: 0 },
    { id: 'val3', name: 'Validator #3', peerId: 'PoS-3', x: cx + 42, y: height * 0.49, role: 'validator', isOffline: false, litGlow: 0 },

    // Layer 1 Peers (Near Alice)
    { id: 'p1', name: 'Peer Node', peerId: '0x2b', x: width * 0.26, y: height * 0.24, role: 'peer', isOffline: false, litGlow: 0 },
    { id: 'p2', name: 'Peer Node', peerId: '0x8f', x: width * 0.74, y: height * 0.24, role: 'peer', isOffline: false, litGlow: 0 },
    { id: 'p3', name: 'Peer Node', peerId: '0x14', x: width * 0.13, y: height * 0.36, role: 'peer', isOffline: false, litGlow: 0 },
    { id: 'p4', name: 'Peer Node', peerId: '0xa9', x: width * 0.87, y: height * 0.36, role: 'peer', isOffline: false, litGlow: 0 },

    // Layer 2 Peers (Mid-Flanks)
    { id: 'p5', name: 'Peer Node', peerId: '0x3c', x: width * 0.19, y: height * 0.50, role: 'peer', isOffline: false, litGlow: 0 },
    { id: 'p6', name: 'Peer Node', peerId: '0x6d', x: width * 0.81, y: height * 0.50, role: 'peer', isOffline: false, litGlow: 0 },

    // Layer 3 Peers (Towards Bob)
    { id: 'p7', name: 'Peer Node', peerId: '0x5e', x: width * 0.13, y: height * 0.64, role: 'peer', isOffline: false, litGlow: 0 },
    { id: 'p8', name: 'Peer Node', peerId: '0x77', x: width * 0.87, y: height * 0.64, role: 'peer', isOffline: false, litGlow: 0 },
    { id: 'p9', name: 'Peer Node', peerId: '0x42', x: width * 0.26, y: height * 0.76, role: 'peer', isOffline: false, litGlow: 0 },
    { id: 'p10', name: 'Peer Node', peerId: '0x91', x: width * 0.74, y: height * 0.76, role: 'peer', isOffline: false, litGlow: 0 },

    // Internal routing peers
    { id: 'p11', name: 'Peer Node', peerId: '0xdd', x: width * 0.36, y: height * 0.34, role: 'peer', isOffline: false, litGlow: 0 },
    { id: 'p12', name: 'Peer Node', peerId: '0xee', x: width * 0.64, y: height * 0.34, role: 'peer', isOffline: false, litGlow: 0 },
    { id: 'p13', name: 'Peer Node', peerId: '0xb8', x: width * 0.36, y: height * 0.64, role: 'peer', isOffline: false, litGlow: 0 },
    { id: 'p14', name: 'Peer Node', peerId: '0xcc', x: width * 0.64, y: height * 0.64, role: 'peer', isOffline: false, litGlow: 0 }
  ];

  // P2P Mesh Overlay Network Links (DevP2P)
  const linkDefs = [
    ['alice', 'p1'], ['alice', 'p2'], ['alice', 'p11'], ['alice', 'p12'],
    ['p1', 'p3'], ['p1', 'p11'], ['p1', 'p5'],
    ['p2', 'p4'], ['p2', 'p12'], ['p2', 'p6'],
    ['p11', 'p12'], ['p11', 'val1'], ['p11', 'val2'],
    ['p12', 'val2'], ['p12', 'val3'],
    ['p3', 'p5'], ['p4', 'p6'],
    ['p5', 'p7'], ['p5', 'val1'], ['p5', 'p13'],
    ['p6', 'p8'], ['p6', 'val3'], ['p6', 'p14'],
    ['val1', 'val2'], ['val2', 'val3'], ['val1', 'val3'],
    ['val1', 'p13'], ['val2', 'p13'], ['val2', 'p14'], ['val3', 'p14'],
    ['p7', 'p9'], ['p7', 'p13'],
    ['p8', 'p10'], ['p8', 'p14'],
    ['p13', 'p14'], ['p13', 'p9'], ['p13', 'bob'],
    ['p14', 'p10'], ['p14', 'bob'],
    ['p9', 'bob'], ['p10', 'bob']
  ];

  p2pLinks = linkDefs.map(([uId, vId]) => ({
    u: p2pNodes.find(n => n.id === uId),
    v: p2pNodes.find(n => n.id === vId),
    activity: 0,
    isCanonical: false,
    heartbeatOffset: Math.random() * 100
  })).filter(l => l.u && l.v);
}


// ============================================================================
// 4. SQL SIMULATION CONTROLLER (COMMITS TO CENTRAL SERVER)
// ============================================================================
// 4. SQL & BLOCKCHAIN SIMULATION CONTROLLERS (SIMPLIFIED & HIGH-IMPACT)
// ============================================================================

function executeSqlQuery() {
  if (isSqlServerDown) {
    playSound('alarm');
    updateSqlHud(`[TCP ERROR] connect ECONNREFUSED 192.168.1.10:5432 - Single Point of Failure (SPOF)!`, true);
    showCyberToast({
      title: 'NETWORK ERROR: SINGLE POINT OF FAILURE',
      type: 'danger',
      message: 'Central database server (192.168.1.10:5432) has CRASHED! Connection refused (ECONNREFUSED). Entire client cluster is halted.',
      duration: 4500
    });
    return;
  }

  isSqlRunning = true;
  playSound('tcp_rush');
  updateSqlHud(`[TCP Port 5432] Direct socket stream: Client Alice (192.168.1.15) ➜ Central DB (192.168.1.10)`);

  const alice = sqlClients.find(c => c.id === 'alice');
  const bob = sqlClients.find(c => c.id === 'bob');

  sqlPackets.push({
    fromX: alice.x, fromY: alice.y,
    toX: sqlServer.x, toY: sqlServer.y - sqlServer.h / 2,
    progress: 0,
    duration: 180,
    startTime: performance.now(),
    color: '#00f0ff',
    label: 'TCP [PSH] UPDATE -50 ETH',
    onComplete: () => {
      sqlServer.pulseGlow = 1;
      sqlServer.memoryActivity = 1;

      // In-place mutation
      sqlAccounts.Alice = 450;
      sqlAccounts.Bob = 250;
      renderSqlTable();

      const metric = document.getElementById('sqlMetricCounter');
      if (metric) metric.innerHTML = '<span class="done-tag cyan">COMMITTED</span> 0.82 ms';

      sqlPackets.push({
        fromX: sqlServer.x, fromY: sqlServer.y + sqlServer.h / 2,
        toX: bob.x, toY: bob.y,
        progress: 0,
        duration: 180,
        startTime: performance.now(),
        color: '#00f0ff',
        label: 'TCP [ACK] +50 ETH',
        onComplete: () => {
          bob.pulse = 1;
          isSqlRunning = false;
          updateSqlHud(`[COMMITTED] 1 Query applied directly via TCP socket in 0.82ms. In-place state updated.`);
          updateResultsTable('sql', '0.82 ms', '1 Central DB Core', 'MUTABLE (In-place Overwrite)');
        }
      });
    }
  });
}

async function addBlockchainTransaction() {
  if (isChainTampered) {
    playSound('alarm');
    showCyberToast({
      title: 'TRANSACTION REJECTED',
      type: 'danger',
      message: 'Cryptographic hash mismatch! The chain has been broken by unauthorized alteration. Restore consensus before broadcasting new transactions.',
      duration: 4000
    });
    return;
  }

  isGossipRunning = true;
  updateBlockchainHud(`[P2P GOSSIP] Alice signs Tx (ECDSA secp256k1). Radiating concentric gossip wavefront...`);

  p2pNodes.forEach(n => { n.litGlow = 0; });
  p2pLinks.forEach(l => { l.isCanonical = false; l.activity = 0; });

  const alice = p2pNodes.find(n => n.id === 'alice');
  const bob = p2pNodes.find(n => n.id === 'bob');
  if (!alice || !bob) return;

  const maxDist = Math.hypot(bob.x - alice.x, bob.y - alice.y) * 1.12;
  const waveDuration = 1350;
  const startTime = performance.now();

  p2pWavefronts.push({
    x: alice.x, y: alice.y,
    maxRadius: maxDist,
    duration: waveDuration,
    startTime: startTime
  });

  let hop = 0;

  function animateGossip(now) {
    const elapsed = now - startTime;
    const progress = Math.min(1, elapsed / waveDuration);
    const curRadius = progress * maxDist;

    const currentHop = Math.floor(progress * 8);
    if (currentHop !== hop) {
      hop = currentHop;
      playSound('gossip_ripple', hop);
    }

    // Dynamic 4-Phase Cryptographic Execution HUD
    if (progress < 0.22) {
      updateBlockchainHud(`[PHASE 1/4: CRYPTO SIGN] Alice signs tx payload with ECDSA (secp256k1)`);
    } else if (progress < 0.58) {
      updateBlockchainHud(`[PHASE 2/4: P2P GOSSIP] Concentric wave diffusing across 14,574 DevP2P nodes`);
    } else if (progress < 0.85) {
      updateBlockchainHud(`[PHASE 3/4: BFT QUORUM] PoS Validators verifying nonce & balance integrity`);
    } else {
      updateBlockchainHud(`[PHASE 4/4: SHA-256 MINING] Sealing merkle transactions into immutable block`);
    }

    const solMetric = document.getElementById('solidityMetricCounter');
    if (solMetric) {
      const elapsedMs = Math.min(1420, Math.round(elapsed));
      solMetric.innerHTML = `<span class="done-tag amber">VERIFYING</span> ${elapsedMs} ms`;
    }

    p2pNodes.forEach(node => {
      if (node.isOffline) return;
      const d = Math.hypot(node.x - alice.x, node.y - alice.y);
      if (d <= curRadius && node.litGlow === 0) {
        node.litGlow = 1;
        p2pLinks.forEach(link => {
          if ((link.u.id === node.id && !link.v.isOffline) || (link.v.id === node.id && !link.u.isOffline)) {
            link.activity = 1;
          }
        });
      }
    });

    if (progress < 1) {
      requestAnimationFrame(animateGossip);
    } else {
      isGossipRunning = false;
      playSound('block_mined');

      // Append Block #3 if not present
      if (blockchain.length === 3) {
        const lastBlock = blockchain[blockchain.length - 1];
        sha256(`3|Alice->Bob 50 ETH|${lastBlock.hash}|58392`).then(b3Hash => {
          blockchain.push({
            index: 3,
            data: "Alice->Bob 50 ETH",
            hash: b3Hash.slice(0, 8),
            fullHash: b3Hash,
            prevHash: lastBlock.hash
          });
          renderBlockCards();
        });
      }

      const canonicalRoute = [
        ['alice', 'p11'], ['p11', 'val2'], ['val2', 'p14'], ['p14', 'bob']
      ];
      canonicalRoute.forEach(([uId, vId]) => {
        const link = p2pLinks.find(l => (l.u.id === uId && l.v.id === vId) || (l.u.id === vId && l.v.id === uId));
        if (link) link.isCanonical = true;
      });

      const metric = document.getElementById('solidityMetricCounter');
      if (metric) metric.innerHTML = '<span class="done-tag amber">MINED</span> 1,420 ms';

      if (isP2PPartitioned) {
        updateBlockchainHud(`[BFT CONSENSUS] 30% peers offline, but Gossip wave rerouted to 10,201 active peers. Mined!`);
        updateResultsTable('chain', '1,420 ms', '10,201 Peers (BFT Survives)', 'IMMUTABLE ✓ (SHA-256)');
      } else {
        updateBlockchainHud(`[CONSENSUS REACHED] 14,574 Peers verified ECDSA signature. Block appended.`);
        updateResultsTable('chain', '1,420 ms', '14,574 Peers', 'IMMUTABLE ✓ (SHA-256)');
      }
    }
  }

  requestAnimationFrame(animateGossip);
}

function startRaceSimulation() {
  playSound('click');
  executeSqlQuery();
  addBlockchainTransaction();
}

function dbaTamperSql() {
  if (isSqlServerDown) {
    playSound('alarm');
    showCyberToast({
      title: 'CONNECTION REFUSED',
      type: 'danger',
      message: 'Central database server is offline. Even DBA root terminal cannot connect.',
      duration: 4000
    });
    return;
  }
  playSound('alarm');
  const dba = sqlClients.find(c => c.id === 'dba');
  if (!dba) return;

  // DBA sends covert raw memory overwrite via SSH port 22 directly into DB memory
  sqlPackets.push({
    fromX: dba.x, fromY: dba.y,
    toX: sqlServer.x + 30, toY: sqlServer.y - sqlServer.h / 2,
    progress: 0,
    duration: 220,
    startTime: performance.now(),
    color: '#ef4444',
    label: 'DBA ROOT OVERWRITE',
    onComplete: () => {
      sqlServer.pulseGlow = 1.5;
      sqlServer.memoryActivity = 2; // Red glitch indicator
      sqlAccounts.Alice = 999999;
      renderSqlTable();
      updateSqlHud(`[DBA TAMPER] UPDATE accounts SET balance = 999999 WHERE id = 'Alice' (ACCEPTED BY ROOT)`, true);
      showCyberToast({
        title: 'SQL DBA TAMPER: SILENT OVERWRITE',
        type: 'danger',
        message: 'Database Administrator (192.168.1.99) executed raw memory overwrite:<br><code>UPDATE accounts SET balance = 999999;</code><br><br>➜ In-place memory silently modified with zero cryptographic verification or consensus!',
        duration: 7000
      });
      updateResultsTable('sql', '0.82 ms', '1 Central Core', 'TAMPERED (Silently Overwritten!)');
    }
  });
}

function toggleTamperBlockchain() {
  const btn = document.getElementById('btnTamperBlockchain');
  if (!isChainTampered) {
    playSound('alarm');
    isChainTampered = true;
    if (blockchain[1]) {
      blockchain[1].data = "Deposit 9,999 ETH (FAKE)";
      blockchain[1].hash = "bad_c0de";
    }
    renderBlockCards();
    updateBlockchainHud(`[BFT SECURITY ALERT] Block #1 Tampered! PrevHash mismatch at Block #2! Chain rejected!`, true);
    if (btn) {
      btn.innerHTML = "🛡️ Restore Consensus";
      btn.className = "btn-action danger";
    }
    showCyberToast({
      title: 'SECURITY ALERT: BLOCK TAMPER DETECTED',
      type: 'danger',
      message: 'Malicious actor altered Block #1 payload to 9,999 ETH.<br><br>➜ Hash changed ➜ Mismatch with Block #2 PreviousHash!<br>➜ All 14,574 P2P nodes immediately <strong>REJECTED</strong> the invalid chain!',
      duration: 7500
    });
    updateResultsTable('chain', 'REJECTED', '14,574 Peers', 'INVALID CHAIN (Tamper Detected!)');
  } else {
    playSound('restore');
    isChainTampered = false;
    initBlockchainLedger();
    updateBlockchainHud(`[CANONICAL RESTORED] Canonical chain synchronized across 14,574 peers.`);
    if (btn) {
      btn.innerHTML = "💥 Tamper Block (Chain)";
      btn.className = "btn-action danger";
    }
    showCyberToast({
      title: 'CONSENSUS RESTORED',
      type: 'success',
      message: 'Canonical blockchain successfully re-synchronized across all peer nodes in the mesh network.',
      duration: 3500
    });
    updateResultsTable('chain', '1,420 ms', '14,574 Peers', 'IMMUTABLE ✓ (SHA-256)');
  }
}

function toggleSqlServerCrash() {
  isSqlServerDown = !isSqlServerDown;
  const btn = document.getElementById('btnCrashSqlServer');

  if (isSqlServerDown) {
    playSound('alarm');
    if (btn) {
      btn.innerHTML = "🟢 Restore Server";
      btn.className = "btn-action danger";
    }
    const metric = document.getElementById('sqlMetricCounter');
    if (metric) metric.innerHTML = '<span class="done-tag" style="background: rgba(239,68,68,0.2); color:#ef4444;">OFFLINE</span> TIMEOUT';

    updateSqlHud(`[SPOF CRASH] Central DB offline. All client sockets closed with ECONNREFUSED.`, true);
    renderSqlTable();
    showCyberToast({
      title: 'NETWORK ERROR: SERVER CRASH (SPOF)',
      type: 'danger',
      message: 'Central database server (192.168.1.10) has been disconnected! All client connections dropped (Single Point of Failure).',
      duration: 4500
    });
    updateResultsTable('sql', 'TIMEOUT', '0 (OFFLINE)', 'SYSTEM HALTED (SPOF)');
  } else {
    playSound('restore');
    if (btn) {
      btn.innerHTML = "🔌 Crash Server (SPOF)";
      btn.className = "btn-action ghost";
    }
    const metric = document.getElementById('sqlMetricCounter');
    if (metric) metric.innerHTML = '<span class="done-tag cyan">READY</span> 0.82 ms';

    sqlServer.memoryActivity = 0;
    renderSqlTable();
    updateSqlHud(`[RECOVERY] Central DB restarted on Port 5432. All client sockets reconnected.`);
    showCyberToast({
      title: 'SERVER RESTORED',
      type: 'success',
      message: 'Central SQL database is back online and accepting queries.',
      duration: 3000
    });
    updateResultsTable('sql', '0.82 ms', '1 Central DB Core', 'MUTABLE (In-place Overwrite)');
  }
}

function toggleP2PPartition() {
  isP2PPartitioned = !isP2PPartitioned;
  const btn = document.getElementById('btnPartitionP2P');
  const droppedIds = ['p1', 'p6', 'p7', 'p10', 'p12']; // ~30% node

  if (isP2PPartitioned) {
    playSound('alarm');
    if (btn) {
      btn.innerHTML = "🟢 Restore 100% Nodes";
      btn.className = "btn-action amber";
    }

    p2pNodes.forEach(n => {
      if (droppedIds.includes(n.id)) n.isOffline = true;
    });

    updateBlockchainHud(`[BFT TEST] 30% of network nodes disconnected. Testing Gossip Mesh rerouting...`, true);
    showCyberToast({
      title: 'P2P MESH: BYZANTINE FAULT TOLERANCE (BFT)',
      type: 'amber',
      message: 'Disconnected ~30% of network nodes. Trigger "Race Comparison" or "P2P Gossip": Wavefront reroutes across surviving peers to reach consensus without downtime!',
      duration: 5500
    });
  } else {
    playSound('restore');
    if (btn) {
      btn.innerHTML = "📶 Drop 30% Nodes (BFT)";
      btn.className = "btn-action ghost";
    }

    p2pNodes.forEach(n => { n.isOffline = false; });
    updateBlockchainHud(`[MESH HEALTH] 100% peer nodes online and synchronized.`);
    showCyberToast({
      title: 'NETWORK RESTORED',
      type: 'success',
      message: 'All 14,574 P2P nodes reconnected and synchronized.',
      duration: 3000
    });
  }
}

function resetDemo() {
  playSound('restore');
  isSqlServerDown = false;
  isP2PPartitioned = false;
  isChainTampered = false;

  sqlAccounts = { Alice: 500, Bob: 200, Charlie: 100 };
  sqlServer.memoryActivity = 0;
  sqlPackets = [];

  p2pNodes.forEach(n => { n.isOffline = false; n.litGlow = 0; });
  p2pLinks.forEach(l => { l.isCanonical = false; l.activity = 0; });

  const btnCrash = document.getElementById('btnCrashSqlServer');
  if (btnCrash) {
    btnCrash.innerHTML = "🔌 Crash Server (SPOF)";
    btnCrash.className = "btn-action ghost";
  }

  const btnBft = document.getElementById('btnPartitionP2P');
  if (btnBft) {
    btnBft.innerHTML = "📶 Drop 30% Nodes (BFT)";
    btnBft.className = "btn-action ghost";
  }

  const btnTamperBlockchain = document.getElementById('btnTamperBlockchain');
  if (btnTamperBlockchain) {
    btnTamperBlockchain.innerHTML = "💥 Tamper Block (Chain)";
    btnTamperBlockchain.className = "btn-action danger";
  }

  const sqlMetric = document.getElementById('sqlMetricCounter');
  if (sqlMetric) sqlMetric.innerHTML = '<span class="done-tag cyan">READY</span> 0.82 ms';

  const solMetric = document.getElementById('solidityMetricCounter');
  if (solMetric) solMetric.innerHTML = '<span class="done-tag amber">READY</span> 1,420 ms';

  updateResultsTable('sql', '0.82 ms', '1 Central DB Core', 'MUTABLE (Admin Overwrite)');
  updateResultsTable('chain', '1,420 ms', '14,574 Nodes', 'IMMUTABLE (SHA-256)');

  updateSqlHud(`[TCP Port 5432] Direct socket stream to Central DB server (0.82ms)`);
  updateBlockchainHud(`[DevP2P Mesh] Concentric Gossip wavefront propagating across peer network`);

  renderSqlTable();
  initBlockchainLedger();

  showCyberToast({
    title: 'DEMO RESET',
    type: 'success',
    message: 'Network topologies and ledger states have been reset to baseline.',
    duration: 2500
  });
}


// ============================================================================
// 6. CANVAS RENDERING ENGINE (AUTHENTIC COMPUTER NETWORKING INFRASTRUCTURE)
// ============================================================================
const sqlCanvas = document.getElementById('sqlNetworkCanvas');
const sqlCtx = sqlCanvas ? sqlCanvas.getContext('2d') : null;

const p2pCanvas = document.getElementById('p2pNetworkCanvas');
const p2pCtx = p2pCanvas ? p2pCanvas.getContext('2d') : null;

function resizeCanvases() {
  if (sqlCanvas && sqlCanvas.parentElement) {
    const r = sqlCanvas.parentElement.getBoundingClientRect();
    sqlCanvas.width = r.width;
    sqlCanvas.height = r.height || 400;
  }
  if (p2pCanvas && p2pCanvas.parentElement) {
    const r = p2pCanvas.parentElement.getBoundingClientRect();
    p2pCanvas.width = r.width;
    p2pCanvas.height = r.height || 400;
  }
  if (sqlCanvas) {
    initNetworkTopologies(sqlCanvas.width, sqlCanvas.height);
  }
}

// ----------------------------------------------------------------------------
// A. RENDER SQL STAR TOPOLOGY (CLIENT-SERVER DATACENTER)
// ----------------------------------------------------------------------------
function renderSqlMap() {
  if (!sqlCtx || !sqlCanvas) return;
  const w = sqlCanvas.width;
  const h = sqlCanvas.height;
  sqlCtx.clearRect(0, 0, w, h);

  const now = performance.now();

  // 1. Datacenter Server Room Background with Circuit Grid
  sqlCtx.fillStyle = '#03070f';
  sqlCtx.fillRect(0, 0, w, h);

  // Subtle circuit grid
  sqlCtx.strokeStyle = 'rgba(0, 240, 255, 0.035)';
  sqlCtx.lineWidth = 1;
  const gridSize = 32;
  for (let x = 0; x < w; x += gridSize) {
    sqlCtx.beginPath();
    sqlCtx.moveTo(x, 0);
    sqlCtx.lineTo(x, h);
    sqlCtx.stroke();
  }
  for (let y = 0; y < h; y += gridSize) {
    sqlCtx.beginPath();
    sqlCtx.moveTo(0, y);
    sqlCtx.lineTo(w, y);
    sqlCtx.stroke();
  }

  // 2. Draw Star Topology Cables connecting Clients to Central Server
  sqlCables.forEach(cable => {
    const c = cable.client;
    sqlCtx.save();

    if (isSqlServerDown) {
      // Severed cable connection when server is offline (ECONNREFUSED)
      sqlCtx.beginPath();
      sqlCtx.setLineDash([5, 5]);
      sqlCtx.moveTo(c.x, c.y);
      sqlCtx.lineTo(sqlServer.x, sqlServer.y);
      sqlCtx.strokeStyle = 'rgba(239, 68, 68, 0.35)';
      sqlCtx.lineWidth = 1.5;
      sqlCtx.stroke();
      sqlCtx.setLineDash([]);

      // Connection failure icon (✕) at cable midpoint
      const midX = (c.x + sqlServer.x) / 2;
      const midY = (c.y + sqlServer.y) / 2;
      sqlCtx.fillStyle = '#ef4444';
      sqlCtx.font = 'bold 9px monospace';
      sqlCtx.textAlign = 'center';
      sqlCtx.fillText('✕', midX, midY + 3);
    } else {
      // Normal active network cable
      sqlCtx.beginPath();
      sqlCtx.moveTo(c.x, c.y);
      sqlCtx.lineTo(sqlServer.x, sqlServer.y);
      sqlCtx.strokeStyle = c.id === 'dba' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(0, 240, 255, 0.12)';
      sqlCtx.lineWidth = 1.5;
      sqlCtx.stroke();

      // Idle heartbeat pulse packet
      const t = ((now * 0.04 + cable.heartbeatOffset) % 100) / 100;
      const px = c.x + (sqlServer.x - c.x) * t;
      const py = c.y + (sqlServer.y - c.y) * t;
      sqlCtx.beginPath();
      sqlCtx.arc(px, py, 2, 0, Math.PI * 2);
      sqlCtx.fillStyle = c.id === 'dba' ? 'rgba(245, 158, 11, 0.5)' : 'rgba(0, 240, 255, 0.4)';
      sqlCtx.fill();
    }
    sqlCtx.restore();
  });

  // 3. Draw Central Server Rack (Datacenter DB Rack Unit)
  const sx = sqlServer.x - sqlServer.w / 2;
  const sy = sqlServer.y - sqlServer.h / 2;

  sqlCtx.save();
  // Server glow aura
  if (!isSqlServerDown) {
    sqlCtx.shadowColor = sqlServer.memoryActivity === 2 ? '#ef4444' : '#00f0ff';
    sqlCtx.shadowBlur = 18 + Math.sin(now / 200) * 4;
  } else {
    sqlCtx.shadowColor = '#ef4444';
    sqlCtx.shadowBlur = 25;
  }

  // Metallic server rack chassis
  sqlCtx.fillStyle = isSqlServerDown ? '#1c0a0a' : '#071524';
  sqlCtx.strokeStyle = isSqlServerDown ? '#ef4444' : (sqlServer.memoryActivity === 2 ? '#f59e0b' : '#00f0ff');
  sqlCtx.lineWidth = 2;
  sqlCtx.beginPath();
  sqlCtx.roundRect(sx, sy, sqlServer.w, sqlServer.h, 8);
  sqlCtx.fill();
  sqlCtx.stroke();
  sqlCtx.shadowBlur = 0;

  // 3 Server Blades inside the Rack
  const bladeH = 16;
  for (let b = 0; b < 3; b++) {
    const by = sy + 6 + b * (bladeH + 4);
    sqlCtx.fillStyle = isSqlServerDown ? '#2b0d0d' : '#0b1d30';
    sqlCtx.strokeStyle = isSqlServerDown ? 'rgba(239, 68, 68, 0.3)' : 'rgba(0, 240, 255, 0.25)';
    sqlCtx.lineWidth = 1;
    sqlCtx.fillRect(sx + 8, by, sqlServer.w - 16, bladeH);
    sqlCtx.strokeRect(sx + 8, by, sqlServer.w - 16, bladeH);

    // Drive Activity LEDs
    for (let led = 0; led < 4; led++) {
      const ledX = sx + 14 + led * 7;
      const ledY = by + bladeH / 2;
      const isBlinking = !isSqlServerDown && ((now + b * 130 + led * 80) % 300 < 150);

      sqlCtx.beginPath();
      sqlCtx.arc(ledX, ledY, 1.8, 0, Math.PI * 2);
      sqlCtx.fillStyle = isSqlServerDown ? '#ef4444' : (isBlinking ? '#38bdf8' : '#0369a1');
      sqlCtx.fill();
    }

    // Drive bay label
    sqlCtx.fillStyle = isSqlServerDown ? '#f87171' : '#94a3b8';
    sqlCtx.font = 'bold 7.5px monospace';
    sqlCtx.textAlign = 'left';
    sqlCtx.fillText(`BAY 0${b + 1}: ${isSqlServerDown ? 'OFFLINE' : (b === 0 ? 'RAM' : 'SSD')}`, sx + 46, by + bladeH / 2 + 2.5);
  }

  // Server fan angle
  sqlServer.fanAngle += 0.08;

  // Primary server status text
  sqlCtx.fillStyle = isSqlServerDown ? '#fca5a5' : '#e0f2fe';
  sqlCtx.font = 'bold 8.5px monospace';
  sqlCtx.textAlign = 'center';
  sqlCtx.fillText(
    isSqlServerDown ? '⚠️ SPOF CRASH (OFFLINE)' : (sqlServer.memoryActivity === 2 ? '⚠️ DBA TAMPER DETECTED' : 'CENTRAL DB: 192.168.1.10:5432'),
    sqlServer.x,
    sy + sqlServer.h + 14
  );

  // Electrical sparks if server crashes
  if (isSqlServerDown && Math.random() < 0.3) {
    sqlSparks.push({
      x: sx + Math.random() * sqlServer.w,
      y: sy + Math.random() * sqlServer.h,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      life: 1
    });
  }

  // Draw spark particles
  sqlSparks.forEach((sp, idx) => {
    sp.x += sp.vx;
    sp.y += sp.vy;
    sp.life -= 0.06;
    sqlCtx.beginPath();
    sqlCtx.arc(sp.x, sp.y, 1.5, 0, Math.PI * 2);
    sqlCtx.fillStyle = `rgba(239, 68, 68, ${sp.life})`;
    sqlCtx.fill();
  });
  sqlSparks = sqlSparks.filter(sp => sp.life > 0);

  sqlCtx.restore();

  // 4. Draw Client Workstations
  sqlClients.forEach(c => {
    sqlCtx.save();
    const isAliceOrBob = c.id === 'alice' || c.id === 'bob';

    // Draw node circular frame
    sqlCtx.beginPath();
    sqlCtx.arc(c.x, c.y, isAliceOrBob ? 14 : 10, 0, Math.PI * 2);

    if (c.pulse > 0) {
      sqlCtx.shadowColor = '#00f0ff';
      sqlCtx.shadowBlur = 20;
      c.pulse = Math.max(0, c.pulse - 0.03);
    }

    sqlCtx.fillStyle = c.id === 'dba' ? '#1f1305' : '#081726';
    sqlCtx.fill();
    sqlCtx.strokeStyle = c.id === 'dba' ? '#f59e0b' : '#00f0ff';
    sqlCtx.lineWidth = isAliceOrBob ? 2 : 1;
    sqlCtx.stroke();

    // Node Name & IP Label
    sqlCtx.fillStyle = '#94a3b8';
    sqlCtx.font = '7.5px monospace';
    sqlCtx.textAlign = 'center';

    if (c.id === 'gateway') {
      sqlCtx.fillText('API Gateway', c.x, c.y + 18);
      sqlCtx.fillText('192.168.1.12', c.x, c.y + 26);
    } else if (c.id === 'mobile') {
      sqlCtx.fillText('Mobile App', c.x, c.y + 18);
      sqlCtx.fillText('192.168.1.33', c.x, c.y + 26);
    } else if (c.id === 'worker') {
      sqlCtx.fillText('Worker Service', c.x, c.y + 18);
      sqlCtx.fillText('192.168.1.45', c.x, c.y + 26);
    } else if (c.id === 'analytics') {
      sqlCtx.fillText('Analytics DB', c.x, c.y + 18);
      sqlCtx.fillText('192.168.1.72', c.x, c.y + 26);
    } else if (c.id === 'dba') {
      sqlCtx.fillStyle = '#f59e0b';
      sqlCtx.fillText('DBA Root Terminal', c.x, c.y + 18);
      sqlCtx.fillText('192.168.1.99', c.x, c.y + 26);
    }

    sqlCtx.restore();
  });

  // 5. Update and Draw Active TCP Sockets & Packets
  sqlPackets.forEach(pkt => {
    const elapsed = now - pkt.startTime;
    pkt.progress = Math.min(1, elapsed / pkt.duration);

    const px = pkt.fromX + (pkt.toX - pkt.fromX) * pkt.progress;
    const py = pkt.fromY + (pkt.toY - pkt.fromY) * pkt.progress;

    sqlCtx.save();
    sqlCtx.beginPath();
    sqlCtx.arc(px, py, 4, 0, Math.PI * 2);
    sqlCtx.fillStyle = pkt.color;
    sqlCtx.shadowColor = pkt.color;
    sqlCtx.shadowBlur = 14;
    sqlCtx.fill();

    // Packet motion blur trail
    const tailX = pkt.fromX + (pkt.toX - pkt.fromX) * Math.max(0, pkt.progress - 0.18);
    const tailY = pkt.fromY + (pkt.toY - pkt.fromY) * Math.max(0, pkt.progress - 0.18);
    sqlCtx.beginPath();
    sqlCtx.moveTo(px, py);
    sqlCtx.lineTo(tailX, tailY);
    sqlCtx.strokeStyle = pkt.color;
    sqlCtx.lineWidth = 3;
    sqlCtx.stroke();

    // Packet payload label
    if (pkt.label) {
      sqlCtx.fillStyle = '#ffffff';
      sqlCtx.font = 'bold 8px monospace';
      sqlCtx.fillText(pkt.label, px + 8, py - 4);
    }
    sqlCtx.restore();

    if (pkt.progress >= 1 && !pkt.completed) {
      pkt.completed = true;
      if (pkt.onComplete) pkt.onComplete();
    }
  });

  sqlPackets = sqlPackets.filter(p => !p.completed);
}


// ----------------------------------------------------------------------------
// B. RENDER BLOCKCHAIN P2P MESH (GOSSIP WAVEFRONT & CONSENSUS)
// ----------------------------------------------------------------------------
function renderP2PMap() {
  if (!p2pCtx || !p2pCanvas) return;
  const w = p2pCanvas.width;
  const h = p2pCanvas.height;
  p2pCtx.clearRect(0, 0, w, h);

  const now = performance.now();

  // 1. Decentralized Constellation Cyberspace Background
  p2pCtx.fillStyle = '#040508';
  p2pCtx.fillRect(0, 0, w, h);

  // Subtle geometric grid
  p2pCtx.strokeStyle = 'rgba(245, 158, 11, 0.025)';
  p2pCtx.lineWidth = 1;
  const hexStep = 44;
  for (let x = 0; x < w; x += hexStep) {
    p2pCtx.beginPath();
    p2pCtx.moveTo(x, 0);
    p2pCtx.lineTo(x, h);
    p2pCtx.stroke();
  }
  for (let y = 0; y < h; y += hexStep) {
    p2pCtx.beginPath();
    p2pCtx.moveTo(0, y);
    p2pCtx.lineTo(w, y);
    p2pCtx.stroke();
  }

  // 2. Draw Concentric Gossip Wavefronts ("spreads in rings") radiating from Alice
  p2pWavefronts.forEach(wave => {
    const elapsed = now - wave.startTime;
    const progress = Math.min(1, elapsed / wave.duration);
    const r = progress * wave.maxRadius;

    p2pCtx.save();
    for (let ring = 0; ring < 3; ring++) {
      const ringR = r - ring * 38;
      if (ringR > 0) {
        p2pCtx.beginPath();
        p2pCtx.arc(wave.x, wave.y, ringR, 0, Math.PI * 2);
        p2pCtx.strokeStyle = `rgba(245, 158, 11, ${Math.max(0, (1 - progress) * (0.45 - ring * 0.12))})`;
        p2pCtx.lineWidth = 2.5;
        p2pCtx.stroke();
      }
    }
    p2pCtx.restore();

    if (progress >= 1) wave.done = true;
  });
  p2pWavefronts = p2pWavefronts.filter(w => !w.done);

  // 3. Draw P2P Mesh Overlay Links
  p2pLinks.forEach(link => {
    const u = link.u;
    const v = link.v;
    if (!u || !v) return;

    p2pCtx.save();

    if (u.isOffline || v.isOffline) {
      // Link connected to offline peer (BFT Partition)
      p2pCtx.beginPath();
      p2pCtx.setLineDash([3, 4]);
      p2pCtx.moveTo(u.x, u.y);
      p2pCtx.lineTo(v.x, v.y);
      p2pCtx.strokeStyle = 'rgba(71, 85, 105, 0.25)';
      p2pCtx.lineWidth = 1;
      p2pCtx.stroke();
      p2pCtx.setLineDash([]);
    } else if (isChainTampered && (u.id === 'alice' || v.id === 'alice')) {
      // Cryptographic firewall quarantine when tampering is detected
      p2pCtx.beginPath();
      p2pCtx.moveTo(u.x, u.y);
      p2pCtx.lineTo(v.x, v.y);
      p2pCtx.strokeStyle = '#ef4444';
      p2pCtx.lineWidth = 2;
      p2pCtx.shadowColor = '#ef4444';
      p2pCtx.shadowBlur = 12;
      p2pCtx.stroke();
    } else if (link.isCanonical) {
      // Confirmed canonical consensus route (Radiant golden beam)
      p2pCtx.beginPath();
      p2pCtx.moveTo(u.x, u.y);
      p2pCtx.lineTo(v.x, v.y);
      p2pCtx.strokeStyle = '#fbbf24';
      p2pCtx.lineWidth = 3;
      p2pCtx.shadowColor = '#f59e0b';
      p2pCtx.shadowBlur = 16;
      p2pCtx.stroke();
    } else if (link.activity > 0) {
      // Gossip wavefront sweeping through this link
      p2pCtx.beginPath();
      p2pCtx.moveTo(u.x, u.y);
      p2pCtx.lineTo(v.x, v.y);
      p2pCtx.strokeStyle = `rgba(245, 158, 11, ${link.activity})`;
      p2pCtx.lineWidth = 2;
      p2pCtx.stroke();
      link.activity = Math.max(0, link.activity - 0.018);
    } else {
      // Default subtle background P2P link
      p2pCtx.beginPath();
      p2pCtx.moveTo(u.x, u.y);
      p2pCtx.lineTo(v.x, v.y);
      p2pCtx.strokeStyle = 'rgba(245, 158, 11, 0.09)';
      p2pCtx.lineWidth = 1;
      p2pCtx.stroke();

      // Periodic heartbeat data pulse
      const t = ((now * 0.03 + link.heartbeatOffset) % 100) / 100;
      const px = u.x + (v.x - u.x) * t;
      const py = u.y + (v.y - u.y) * t;
      p2pCtx.beginPath();
      p2pCtx.arc(px, py, 1.5, 0, Math.PI * 2);
      p2pCtx.fillStyle = 'rgba(245, 158, 11, 0.25)';
      p2pCtx.fill();
    }

    p2pCtx.restore();
  });

  // 4. Draw Validator Consensus Quorum Cluster (Center)
  const val1 = p2pNodes.find(n => n.id === 'val1');
  const val2 = p2pNodes.find(n => n.id === 'val2');
  const val3 = p2pNodes.find(n => n.id === 'val3');
  if (val1 && val2 && val3) {
    p2pCtx.save();
    p2pCtx.beginPath();
    p2pCtx.moveTo(val1.x, val1.y);
    p2pCtx.lineTo(val2.x, val2.y);
    p2pCtx.lineTo(val3.x, val3.y);
    p2pCtx.closePath();
    p2pCtx.fillStyle = isChainTampered ? 'rgba(239, 68, 68, 0.08)' : 'rgba(245, 158, 11, 0.06)';
    p2pCtx.fill();
    p2pCtx.strokeStyle = isChainTampered ? 'rgba(239, 68, 68, 0.4)' : 'rgba(245, 158, 11, 0.3)';
    p2pCtx.stroke();

    // Proof-of-Stake consensus quorum label
    p2pCtx.fillStyle = '#fcd34d';
    p2pCtx.font = 'bold 8px monospace';
    p2pCtx.textAlign = 'center';
    p2pCtx.fillText('BFT QUORUM (2/3+ VOTE)', (val1.x + val3.x) / 2, val1.y + 18);
    p2pCtx.restore();
  }

  // 5. Draw P2P Peer Nodes
  p2pNodes.forEach(n => {
    p2pCtx.save();
    const isEndpoint = n.id === 'alice' || n.id === 'bob';
    const isVal = n.role === 'validator';

    if (n.isOffline) {
      // Offline node (Byzantine Fault Tolerance)
      p2pCtx.beginPath();
      p2pCtx.arc(n.x, n.y, 7, 0, Math.PI * 2);
      p2pCtx.fillStyle = '#1e293b';
      p2pCtx.fill();
      p2pCtx.strokeStyle = '#475569';
      p2pCtx.lineWidth = 1;
      p2pCtx.stroke();

      p2pCtx.fillStyle = '#ef4444';
      p2pCtx.font = 'bold 8px monospace';
      p2pCtx.textAlign = 'center';
      p2pCtx.fillText('✕', n.x, n.y + 2.5);
    } else {
      // Online active peer node
      const radius = isEndpoint ? 13 : (isVal ? 9 : 6);
      p2pCtx.beginPath();
      p2pCtx.arc(n.x, n.y, radius, 0, Math.PI * 2);

      if (isChainTampered && n.id === 'alice') {
        p2pCtx.fillStyle = '#ef4444';
        p2pCtx.shadowColor = '#ef4444';
        p2pCtx.shadowBlur = 18;
      } else if (n.litGlow > 0) {
        p2pCtx.fillStyle = '#fbbf24';
        p2pCtx.shadowColor = '#f59e0b';
        p2pCtx.shadowBlur = 16;
        n.litGlow = Math.max(0, n.litGlow - 0.02);
      } else {
        p2pCtx.fillStyle = isVal ? '#3b2505' : '#140c03';
        p2pCtx.shadowBlur = 0;
      }

      p2pCtx.fill();
      p2pCtx.strokeStyle = isChainTampered && n.id === 'alice' ? '#ef4444' : (isVal ? '#f59e0b' : '#d97706');
      p2pCtx.lineWidth = isEndpoint ? 2 : 1.5;
      p2pCtx.stroke();

      // Node identifier text
      p2pCtx.fillStyle = '#fcd34d';
      p2pCtx.font = isEndpoint ? 'bold 9px monospace' : '7.5px monospace';
      p2pCtx.textAlign = 'center';

      if (isEndpoint) {
        p2pCtx.fillText(n.peerId, n.x, n.y + 3);
      } else if (isVal) {
        p2pCtx.fillText(n.peerId, n.x, n.y - 12);
      } else {
        p2pCtx.fillText(n.peerId, n.x, n.y + 13);
      }
    }

    p2pCtx.restore();
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

function renderSqlTable() {
  const tbody = document.getElementById('sqlTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  for (const [name, balance] of Object.entries(sqlAccounts)) {
    const tr = document.createElement('tr');
    let statusHtml = '<span style="color: #38bdf8;">In-place Overwrite</span>';
    if (isSqlServerDown) {
      statusHtml = '<span style="color: #f87171;">OFFLINE (ECONNREFUSED)</span>';
    } else if (isChainTampered && name === 'Alice') {
      statusHtml = '<span style="color: #f87171; font-weight: 700;">⚠️ SILENTLY ALTERED</span>';
      tr.className = 'tampered';
    }

    tr.innerHTML = `
      <td>0x${name}</td>
      <td><strong>${balance.toLocaleString()} ETH</strong></td>
      <td>${statusHtml}</td>
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

function updateResultsTable(arch, latency, nodes, integrity, statusClass = null) {
  if (arch === 'sql') {
    const lat = document.getElementById('tableResLatencySql');
    const nod = document.getElementById('tableResNodesSql');
    const int = document.getElementById('tableResIntegritySql');
    if (lat) lat.innerText = latency;
    if (nod) nod.innerText = nodes;
    if (int) {
      int.innerText = integrity;
      if (statusClass) {
        int.className = `result-val status-badge ${statusClass} col-cell col-integrity`;
      } else if (integrity.includes('TAMPERED') || integrity.includes('HALTED')) {
        int.className = 'result-val status-badge red flash-tamper col-cell col-integrity';
      } else {
        int.className = 'result-val status-badge red col-cell col-integrity';
      }
    }
  } else {
    const lat = document.getElementById('tableResLatencyChain');
    const nod = document.getElementById('tableResNodesChain');
    const int = document.getElementById('tableResIntegrityChain');
    if (lat) lat.innerText = latency;
    if (nod) nod.innerText = nodes;
    if (int) {
      int.innerText = integrity;
      if (statusClass) {
        int.className = `result-val status-badge ${statusClass} col-cell col-integrity`;
      } else if (integrity.includes('INVALID') || integrity.includes('REJECTED')) {
        int.className = 'result-val status-badge red flash-tamper col-cell col-integrity';
      } else {
        int.className = 'result-val status-badge green col-cell col-integrity';
      }
    }
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

// ============================================================================
// 9. MODALS (BLOCK CRYPTOGRAPHIC INSPECTOR & NETWORK PACKET INSPECTOR)
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
    if (statusEl) statusEl.innerHTML = `<span style="color: #ef4444;">❌ HASH COMPLETELY CHANGED! Next block will reject due to broken PreviousHash link.</span>`;
  } else {
    if (hashBox) hashBox.classList.remove('tampered');
    if (statusEl) statusEl.innerHTML = `<span style="color: #34d399;">✓ Perfectly matches distributed ledger state.</span>`;
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
// SYSTEM INITIALIZATION
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
