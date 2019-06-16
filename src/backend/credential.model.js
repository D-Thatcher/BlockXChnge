const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Credential = new Schema({
    user_name: {
        type: String
    },
    user_password: {
        type: String
    },
    user_email: {
        type: String
    },
    user_verified: {
        type: Boolean
    },
    user_account_balance:{
      type: Number
    },
    user_block_hashes:[{type: String}],
    user_paper_account_balance:{
        type: Number
    },
    user_borrowed:{
        type:Number
    },
    user_credibility_points:{
        type:Number
    },
    user_list_current_bets:[{type: String}],
    user_list_recommended_bets:[{type: String}],
    user_list_current_friends:[{type: String}],
    user_list_recommended_friends:[{type: String}],
    user_friends_requests_outgoing:[{type: String}],
    user_friends_requests_incoming:[{type: String}],
    user_block_requests_outgoing:[{type: String}],
    user_block_requests_incoming:[{type: String}]

});

module.exports = mongoose.model('Credential', Credential);