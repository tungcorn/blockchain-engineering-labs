# Blockchain Engineering Labs

[![GitHub Repo](https://img.shields.io/badge/REPO-blockchain--engineering--labs-00f0ff?style=for-the-badge&logo=github&logoColor=white)](https://github.com/tungcorn/blockchain-engineering-labs)
[![Live Demo](https://img.shields.io/badge/LIVE_DEMO-Open_Simulator-00f0ff?style=for-the-badge&logo=googlechrome&logoColor=black)](https://tungcorn.github.io/blockchain-engineering-labs/lab01-blockchain-vs-sql/demo/)
[![Solidity](https://img.shields.io/badge/SOLIDITY-^0.8.20-f59e0b?style=for-the-badge&logo=solidity&logoColor=black)](https://soliditylang.org/)
[![License: MIT](https://img.shields.io/badge/LICENSE-MIT-10b981?style=for-the-badge)](LICENSE)

A hands-on curriculum exploring blockchain systems, consensus protocols, cryptography, smart contracts, and decentralized architecture.

---

## Curriculum Roadmap

| Lab | Topic | Focus Area | Status |
| :--- | :--- | :--- | :---: |
| **[Lab 01](lab01-blockchain-vs-sql/)** | **Blockchain vs SQL • Architectural Simulation** | Network Topologies, SPOF vs BFT, Data Immutability, SHA-256 Avalanche | Complete |
| **Lab 02** | **Solidity Fundamentals & Gas Optimization** | EVM Storage Slots, Reentrancy Guards, Custom Errors, Gas Benchmarks | Upcoming |
| **Lab 03** | **Tokens, Staking Pools & DeFi Primitives** | ERC-20, Staking Rewards Algorithm, Automated Market Makers (AMM) | Planned |
| **Lab 04** | **NFTs & Decentralized Storage** | ERC-721A, IPFS / Filecoin Pinning, Merkle Tree Whitelist Airdrops | Planned |
| **Capstone** | **Fullstack Decentralized Application (DApp)** | Next.js, Wagmi/Viem, Hardhat/Foundry, Testnet Deployment | Planned |

---

## Featured: Lab 01

### [Lab 01: Blockchain vs SQL Visualizer](lab01-blockchain-vs-sql/)
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

Clone the repository and explore any lab module:

```bash
git clone https://github.com/tungcorn/blockchain-engineering-labs.git
cd blockchain-engineering-labs

# Run Lab 01 interactive visualizer locally
cd lab01-blockchain-vs-sql
npx serve demo
```

Or open the live deployment directly in your browser:  
👉 **https://tungcorn.github.io/blockchain-engineering-labs/lab01-blockchain-vs-sql/demo/**

---

## License
This repository is licensed under the [MIT License](LICENSE).
