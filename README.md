# Blockchain Engineering Labs

[![GitHub Repo](https://img.shields.io/badge/REPO-blockchain--engineering--labs-00f0ff?style=for-the-badge&logo=github&logoColor=white)](https://github.com/tungcorn/blockchain-engineering-labs)
[![Live Demo](https://img.shields.io/badge/LIVE_DEMO-Open_Simulator-00f0ff?style=for-the-badge&logo=googlechrome&logoColor=black)](https://tungcorn.github.io/blockchain-engineering-labs/lab01-blockchain-vs-sql/demo/)
[![Solidity](https://img.shields.io/badge/SOLIDITY-^0.8.20-f59e0b?style=for-the-badge&logo=solidity&logoColor=black)](https://soliditylang.org/)
[![License: MIT](https://img.shields.io/badge/LICENSE-MIT-10b981?style=for-the-badge)](LICENSE)

A hands-on repository exploring blockchain architecture, consensus protocols, cryptography, smart contracts, and decentralized systems.

---

## Lab 01: Blockchain vs SQL Visualizer

### Overview
An interactive side-by-side simulator contrasting Centralized Client-Server Databases (Star Topology) with Decentralized Peer-to-Peer Blockchains (Gossip Mesh).

<p align="center">
  <img src="lab01-blockchain-vs-sql/assets/demo-simulation.gif" alt="Lab 01 Architecture Simulation" width="100%">
</p>

* **Race Comparison**: 0.82 ms direct TCP commit vs 1,420 ms decentralized gossip consensus.
* **SPOF Crash vs BFT Partition**: Client-server fails on single host outage; P2P mesh survives 30%+ node loss.
* **DBA Root Overwrite vs Consensus**: Central databases execute unauthorized memory mutation; P2P nodes reject altered blocks.
* **Protocol Inspection**: Raw TCP socket frames vs DevP2P RLPx encrypted consensus packets.

[Launch Live Simulator](https://tungcorn.github.io/blockchain-engineering-labs/lab01-blockchain-vs-sql/demo/) | [Read Lab 01 Documentation](lab01-blockchain-vs-sql/README.md)

---

## Technology Stack

* **Core Languages**: Solidity (^0.8.20), JavaScript (ES2024), SQL (PostgreSQL / MySQL)
* **Cryptographic Primitives**: SHA-256, Keccak-256, ECDSA (secp256k1), Merkle Trees
* **Distributed Networking**: DevP2P, RLPx Framing, TCP/IP Stream Sockets
* **Development & Tooling**: Node.js, Web Audio API, HTML5 Canvas, ffmpeg

---

## Getting Started

### Local Setup
Clone the repository and run the Lab 01 visualizer locally:

```bash
git clone https://github.com/tungcorn/blockchain-engineering-labs.git
cd blockchain-engineering-labs/lab01-blockchain-vs-sql

npx serve demo
```

### Live Browser Deployment
Open directly without installation:  
https://tungcorn.github.io/blockchain-engineering-labs/lab01-blockchain-vs-sql/demo/

---

## License
This repository is licensed under the [MIT License](LICENSE).
