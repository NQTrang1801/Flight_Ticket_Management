// ruleController.js

// Import Rule model and asyncHandler
const Rule = require('../models/ruleModel');
const asyncHandler = require('express-async-handler');

const addOrUpdateRule = asyncHandler(async (req, res) => {
    const { ruleName, code, detail, values } = req.body;
    try {
        let rule = await Rule.findOne({ ruleName, code });

        if (!rule) {
            rule = new Rule({ ruleName, code, detail, values });
        } else {
            rule.code = code;
            rule.detail = detail;
            rule.values = values;
        }

        await rule.save();

        res.status(200).json({ message: "Rule added/updated successfully", rule });
    } catch (error) {
        res.status(500).json({ message: "Failed to add/update rule", error: error.message });
    }
});

const deleteRule = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const rule = await Rule.findByIdAndDelete(id);
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
const getRuleById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const rule = await Rule.findById(id);
        if (!rule) {
            return res.status(404).json({ message: "Rule not found" });
        }
        res.status(200).json(rule);
    } catch (error) {
        res.status(500).json({ message: "Failed to get rule", error: error.message });
    }
});

module.exports = { addOrUpdateRule, deleteRule, getAllRules, getRuleById };
