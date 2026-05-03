// src/services/blockchain.service.js
const crypto = require('crypto');
const BlockModel = require('../models/block.model');

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.nonce = 0;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return crypto
            .createHash('sha256')
            .update(
                this.index +
                this.previousHash +
                this.timestamp +
                JSON.stringify(this.data) +
                this.nonce
            )
            .digest('hex');
    }

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
    }
}

class BlockchainService {
    constructor() {
        this.difficulty = 2; // Fixed difficulty for local PoW
    }

    async getLatestBlock() {
        return await BlockModel.findOne().sort({ index: -1 });
    }

    async addBlock(data) {
        const latestBlock = await this.getLatestBlock();
        const index = latestBlock ? latestBlock.index + 1 : 0;
        const previousHash = latestBlock ? latestBlock.hash : "0";
        const timestamp = Date.now();

        const newBlock = new Block(index, timestamp, data, previousHash);
        newBlock.mineBlock(this.difficulty);

        const savedBlock = new BlockModel({
            index: newBlock.index,
            timestamp: newBlock.timestamp,
            data: newBlock.data,
            previousHash: newBlock.previousHash,
            hash: newBlock.hash,
            nonce: newBlock.nonce
        });

        await savedBlock.save();
        return savedBlock;
    }

    async isChainValid() {
        const blocks = await BlockModel.find().sort({ index: 1 });

        for (let i = 1; i < blocks.length; i++) {
            const currentBlock = blocks[i];
            const previousBlock = blocks[i - 1];

            // Re-calculate current block hash
            const recalculatedHash = crypto
                .createHash('sha256')
                .update(
                    currentBlock.index +
                    currentBlock.previousHash +
                    currentBlock.timestamp +
                    JSON.stringify(currentBlock.data) +
                    currentBlock.nonce
                )
                .digest('hex');

            if (currentBlock.hash !== recalculatedHash) {
                return { valid: false, reason: `Hash mismatch at index ${currentBlock.index}` };
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return { valid: false, reason: `Previous hash mismatch at index ${currentBlock.index}` };
            }
        }

        return { valid: true };
    }

    async getStats() {
        const count = await BlockModel.countDocuments();
        const lastBlock = await this.getLatestBlock();
        return {
            totalBlocks: count,
            lastHash: lastBlock ? lastBlock.hash : null,
            difficulty: this.difficulty
        };
    }
}

module.exports = new BlockchainService();