var server_constants = require('../SERVER_CONSTANTS');
var stripe = require('stripe')(server_constants.TEST_STRIPE_PUBLISHABLE_KEY);


//
// // Idempotency key guarantees this charge can be retried in the event that a network error is caught
//
// async function stripe_deposit(){
//     stripe.charges.create({
//         amount: 2000,
//         currency: "usd",
//         customer: 'customer.id',
//         source: "tok_visa", // obtained with Stripe.js
//         description: "Charge for jenny.rosen@example.com"
//     }, {
//         idempotency_key: "Irwi5tgcSRgcel1Q"
//     }, function(err, charge) {
//         if(err){
//
//         }
//         else{
//
//         }
//         // asynchronously called
//     });
// }
