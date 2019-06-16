var Crypto = require('crypto-js');

function generateHash(contents, nonce,previousHash="1fnak", username1="12das42", username2="9j21bjs89",date="we21SsA"){
    console.log(username1);
    return Crypto.SHA256(previousHash+username1+username2+contents+date+nonce).toString();
}


module.exports = {
    ROOT_ID:"5cf00ac219c45927cc2d58f9",
    BLOCK_NONCE: "fe893bhjbcas17",
    TEST_STRIPE_PUBLISHABLE_KEY:"pk_test_YOUR_ID",
    SRIPE_SECRET: "sk_test_YOUR_ID",
    generateHash:generateHash
};