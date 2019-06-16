const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Blockchain = new Schema({
    block_hash: {
        type: String
    },
    summary: {
        type: String
    }
});

module.exports = mongoose.model('Blockchain', Blockchain);