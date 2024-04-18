// ruleController.js

// Import Rule model and asyncHandler
const Rule = require('../models/ruleModel');
const asyncHandler = require('express-async-handler');

const addOrUpdateRule = asyncHandler(async (req, res) => {
    const { ruleName, code, ruleDetails, value } = req.body;
    try {
        let rule = await Rule.findOne({ ruleName });

        if (!rule) {
            rule = new Rule({ ruleName, code, ruleDetails, value });
        } else {
            rule.code = code;
            rule.ruleDetails = ruleDetails;
            rule.value = value;
        }

        await rule.save();

        res.status(200).json({ message: "Rule added/updated successfully", rule });
    } catch (error) {
        res.status(500).json({ message: "Failed to add/update rule", error: error.message });
    }
});

// Xóa qui định dựa trên ruleName
const deleteRule = asyncHandler(async (req, res) => {
    const { ruleName } = req.params;
    try {
        const rule = await Rule.findOneAndDelete({ ruleName });
        if (!rule) {
            return res.status(404).json({ message: "Rule not found" });
        }
        res.status(200).json({ message: "Rule deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete rule", error: error.message });
    }
});

// Lấy tất cả qui định
const getAllRules = asyncHandler(async (req, res) => {
    try {
        const rules = await Rule.find();
        res.status(200).json(rules);
    } catch (error) {
        res.status(500).json({ message: "Failed to get rules", error: error.message });
    }
});

// Lấy qui định dựa trên ruleName
const getRuleByName = asyncHandler(async (req, res) => {
    const { ruleName } = req.params;
    try {
        const rule = await Rule.findOne({ ruleName });
        if (!rule) {
            return res.status(404).json({ message: "Rule not found" });
        }
        res.status(200).json(rule);
    } catch (error) {
        res.status(500).json({ message: "Failed to get rule", error: error.message });
    }
});

module.exports = { addOrUpdateRule, deleteRule, getAllRules, getRuleByName };
