// routes/rules.js

const express = require('express');
const router = express.Router();
const ruleController = require('../controllers/ruleController');

// Middleware
const { authMiddleware, hasPermission } = require("../middlewares/authMiddleware");

router.post('/511454340/add-update-rule', authMiddleware, hasPermission, ruleController.addOrUpdateRule);
router.delete('/511627340/delete/:id', authMiddleware, hasPermission, ruleController.deleteRule);
router.get('/511320340/all', authMiddleware, hasPermission, ruleController.getAllRules);
router.get('/511320340/:id', authMiddleware, hasPermission, ruleController.getRuleById);

module.exports = router;
