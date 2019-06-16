let Block = require('./blockchain.model');


function strongPassword(p){
    //TODO Optimize by reusing regex and check server side as well
    var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    return strongRegex.test(p)
}

function goodEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}


var bbad = "asasd.com";
var ggoed = "asUsddddas3@gmail.com";
var bp = "asasddsasasddas3";

console.log(goodEmail(bbad));
console.log(goodEmail(ggoed));
console.log(strongPassword(bp));
console.log(strongPassword(ggoed));

