const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const credRoutes = express.Router();
const PORT = 4002;

let Credential = require('./credential.model');

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/credentials', { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
});

credRoutes.route('/').get(function(req, res) {
    Credential.find(function(err, credentials) {
        if (err) {
            console.log(err);
        } else {
            res.json(credentials);
        }
    });
});

credRoutes.route('/:user_name').get(function(req, res) {
    let userName = req.params.user_name;

    Credential.find({user_name: userName},function(err, credential) {
        if (!credential){res.status(404).send('data is not found');}
        res.json(credential[0]);
    });
});//

//Multiple?
credRoutes.route('/check/:user_name').post(function(req, res) {
    let userName = req.params.user_name;
    let userPass = req.body.user_password;

    Credential.find({user_name: userName, user_password:userPass}, function(err, credential) {
        if (credential.toString() === ''){
            res.status(400).send("Credential Username does not exist or password is incorrect");
        }
        else {
            res.json(credential);
        }
    });
});


// Improved Post
credRoutes.route('/add/:user_name').post(function(req, res) {
    let userName = req.params.user_name;
    let credentialInput = new Credential(req.body);

    Credential.find({user_name: userName}, function(err, credential) {
        if (credential.toString() === ''){

            credentialInput.save().then(credential => {
                res.json(credential);
            })
                .catch(err => {
                    res.status(400).send("Credential add not possible");
                });
        }
        else {
            console.log('User Not Posted (Username exists already)');
            res.status(400).send('credential already exists');
        }
    });
});

credRoutes.route('/updateFriendRequestReceiver/:user_name').post(function(req, res) {
    let userName = req.body.user_name;
    let user_name_to_add= req.body.user_name_to_add;

    Credential.find({user_name: userName}, function(err, credential) {
        if (!credential)
            res.status(404).send('data is not found');
        else{
            credential[0].user_friends_requests_incoming.push(user_name_to_add);

            // Remove user_name_to_add from receiving user's recommended friends
            var index = credential[0].user_list_recommended_friends.indexOf(user_name_to_add);
            if (index > -1) {
                credential[0].user_list_recommended_friends.splice(index, 1);
            }

        }

        credential[0].save().then(credential => {
            res.json('Credential updated');
        })
            .catch(err => {
                res.status(400).send("Credential Update not possible");
            });
    });
});

//
credRoutes.route('/update/:user_name').post(function(req, res) {
    let userName = req.body.user_name;
    let recFriends = req.body.user_list_recommended_friends;
    let outgoingFriendReq = req.body.user_friends_requests_outgoing;


    Credential.find({user_name: userName}, function(err, credential) {
        if (!credential)
            res.status(404).send('data is not found');
        else{
            credential[0].user_list_recommended_friends = recFriends;
            credential[0].user_friends_requests_outgoing = outgoingFriendReq;
        }


        credential[0].save().then(credential => {
            res.json('Credential updated');
        })
            .catch(err => {
                res.status(400).send("Credential Update not possible");
            });
    });
});

credRoutes.route('/acceptOtherEndFriendRequest/:user_name').post(function(req, res) {
    let user_name_incoming = req.body.user_name_incoming;
    let user_name_outgoing = req.body.user_name_outgoing;
    Credential.find({user_name: user_name_outgoing}, function (err, credential) {
        if (!credential)
            res.status(404).send('data is not found');
        else {

            // Delete outgoing friend request
            var index_out = credential[0].user_friends_requests_outgoing.indexOf(user_name_incoming);
            if (index_out > -1) {
                credential[0].user_friends_requests_outgoing.splice(index_out, 1);
            }

            // Add to current friends
            credential[0].user_list_current_friends.push(user_name_incoming);
        }

        credential[0].save().then(credential => {
            res.json('Credential updated');
        })
            .catch(err => {
                res.status(400).send("Credential Update not possible");
            });
    });
});


credRoutes.route('/acceptFriendRequest/:user_name').post(function(req, res) {
    let user_name_incoming = req.body.user_name_incoming;
    let user_name_outgoing = req.body.user_name_outgoing;


    Credential.find({user_name: user_name_incoming}, function(err, credential) {
        if (!credential)
            res.status(404).send('data is not found');
        else{

            // Delete incoming friend request
            var index_in = credential[0].user_friends_requests_incoming.indexOf(user_name_outgoing);
            if (index_in > -1) {
                credential[0].user_friends_requests_incoming.splice(index_in, 1);
            }

            // Add to current friends
            credential[0].user_list_current_friends.push(user_name_outgoing);
        }

        credential[0].save().then(credential => {
            res.json('Credential updated');
        })
            .catch(err => {
                res.status(400).send("Credential Update not possible");
            });
    });
});

// Check if a user has a balance greater than or equal to the amount input as parameter. If user does, decrement balance and return true,
// else, return false.
credRoutes.route('/decrementUserBalance').post(function(req, res) {
    let user = req.body.user_name;
    let amount = req.body.amount;
    let is_paper = req.body.is_paper;

    let success = false;


    Credential.find({user_name: user}, function(err, credential) {
        if (!credential)
            res.status(404).send('credential is not found');
        else{
            // console.log('CRED');
            // console.log(credential);
            if (!is_paper){
                if((amount <= credential[0].user_account_balance) && ( amount>0 ) && ( credential[0].user_account_balance>0 ) ){
                    credential[0].user_account_balance -= amount;
                    success = true;
                }
                else{
                    success = false;
                }

            }
            else{
                if((amount <= credential[0].user_paper_account_balance) && ( amount>0 ) && ( credential[0].user_paper_account_balance>0 ) ){
                    credential[0].user_paper_account_balance -= amount;
                    success = true;
                }
                else{
                    success = false;
                }
            }

        }

        if(success){
            credential[0].save().then((cred) =>{
                res.json(true);
            })
        }
        else{
            res.json(false);
        }

    });

});


// Update a user's blocks (user_list_current_bets)
credRoutes.route('/updateUserCurrentBlock').post(function(req, res) {
    let user = req.body.user_name;
    let block = req.body.block_to_add;


    Credential.find({user_name: user}, function(err, credential) {


        if (!credential)
            res.status(404).send('data is not found');
        else{
            credential[0].user_list_current_bets.push(block)
        }

        credential[0].save().then(credential => {
            res.json('Credential updated');
        })
            .catch(err => {
                res.status(400).send("Credential Update not possible");
            });
    });
});

app.use('/credentials', credRoutes);

app.listen(PORT, function() {
    console.log("Credential Server is running on Port: " + PORT);
});

