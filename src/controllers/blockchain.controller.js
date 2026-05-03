// src/controllers/blockchain.controller.js
const blockchainService = require('../services/blockchain.service');

/**
 * @desc    Get blockchain stats
 * @route   GET /api/blockchain/stats
 * @access  Public
 */
exports.getBlockchainStats = async (req, res) => {
    try {
        const stats = await blockchainService.getStats();
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Verify blockchain integrity
 * @route   GET /api/blockchain/verify
 * @access  Public
 */
exports.verifyBlockchain = async (req, res) => {
    try {
        const result = await blockchainService.isChainValid();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Get all blocks
 * @route   GET /api/blockchain/blocks
 * @access  Public
 */
exports.getBlocks = async (req, res) => {
    try {
        const Block = require('../models/block.model');
        const blocks = await Block.find().sort({ index: -1 });
        res.status(200).json(blocks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};