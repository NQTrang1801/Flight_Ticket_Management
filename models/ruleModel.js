const mongoose = require('mongoose');

const ruleSchema = new mongoose.Schema({
    ruleName: {
        type: String,
        required: true,
        unique: true
    },
    ruleDetails: {
        type: String,
        required: true
    },
    value: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    }
});

const Rule = mongoose.model('Rule', ruleSchema);

module.exports = Rule;
