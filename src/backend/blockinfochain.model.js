const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let BlockInfochain = new Schema({
    user1: {
        type: String
    },
    user2: {
        type: String
    },
    agreement: {
        type: String
    },
    completion_date: {
        type: String
    },
    summary: {
        type: String
    }
});

module.exports = mongoose.model('BlockInfochain', BlockInfochain);