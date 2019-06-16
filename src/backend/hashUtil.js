var Crypto = require('crypto-js');

export function generateHash(contents, nonce,previousHash="1fnak", username1="12das42", username2="9j21bjs89",date="we21SsA"){
    console.log(username1);
    return Crypto.SHA256(previousHash+username1+username2+contents+date+nonce).toString();
}

