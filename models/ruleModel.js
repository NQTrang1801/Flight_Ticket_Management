const mongoose = require('mongoose');

const ruleSchema = new mongoose.Schema({
    ruleName: { type: String, required: true },
    code: { type: String, required: true },
    detail: { type: String },
    values: { type: Object, required: true }
});

const Rule = mongoose.model('Rule', ruleSchema);

module.exports = Rule;
