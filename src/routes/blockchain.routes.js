const express = require('express');
const router = express.Router();
const blockchainController = require('../controllers/blockchain.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { isAuditor } = require('../middlewares/role.middleware');

router.get('/stats', blockchainController.getBlockchainStats);
router.get('/verify', verifyToken, isAuditor, blockchainController.verifyBlockchain);
router.get('/blocks', verifyToken, isAuditor, blockchainController.getBlocks);
router.get('/export-audit', verifyToken, isAuditor, blockchainController.getBlockchainStats); // Placeholder for PDF logic

module.exports = router;