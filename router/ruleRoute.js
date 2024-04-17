// routes/rules.js

const express = require('express');
const router = express.Router();
const ruleController = require('../controllers/ruleController');

// Middleware
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

// Route để thêm mới hoặc cập nhật qui định
router.post('/add-update-rule', authMiddleware, isAdmin, ruleController.addOrUpdateRule);

// Route để xóa qui định dựa trên ruleName
router.delete('/delete-rule/:ruleName', authMiddleware, isAdmin, ruleController.deleteRule);

// Route để lấy tất cả các qui định
router.get('/all-rules', authMiddleware, isAdmin, ruleController.getAllRules);

// Route để lấy qui định dựa trên ruleName
router.get('/get-rule/:ruleName', authMiddleware, isAdmin, ruleController.getRuleByName);

module.exports = router;
