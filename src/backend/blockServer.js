
var server_constants = require('../SERVER_CONSTANTS');
// var root_id = require('../SERVER_CONSTANTS');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const blockRoutes = express.Router();
const PORT = 4000;

let Block = require('./blockchain.model');

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/blockchain', {useNewUrlParser: true});
const connection = mongoose.connection;

connection.once('open', function () {
    console.log("MongoDB database connection to blockchain established successfully");
});

blockRoutes.route('/').get(function (req, res) {
    Block.find(function (err, todos) {
        if (err) {
            console.log(err);
        } else {
            res.json(todos);
        }
    });
});//


// Root Block Stores the most recent hash in the chain as its summary.
// This function finds the root by its id and uses it's summary (most recent block-hash before this one) to hash-link the new block.
// Finally, it updates the root's summary with this block's hash.
blockRoutes.route('/getLast2').get(function (req, res) {
    let user1 = req.query.user1;
    let user2 = req.query.user2;
    let summary = req.query.summary;

    let agreement = req.query.agreement;
    let completion_date = req.query.completion_date;

    Block.findById(server_constants.ROOT_ID, function (err, block) {


        var async_hash = server_constants.generateHash(agreement, server_constants.BLOCK_NONCE, block.summary, user1, user2, completion_date);

        let saveBlock = new Block({
            block_hash: async_hash,
            summary: summary
        });
        saveBlock.save().then(dblock => {
            block.summary = dblock.block_hash;
            block.save();
        }).catch(err => {
            res.status(400).send('adding new Block failed');
        });
    });
});

// blockRoutes.route('/add').post(function(req, res) {
//     //
//     let block = new Block(req.body);
//     block.save()
//         .then(todo => {
//             res.status(200).json({'Block': 'Block added successfully'});
//         })
//         .catch(err => {
//             res.status(400).send('adding new Block failed');
//         });
// });


app.use('/blockchain', blockRoutes);

app.listen(PORT, function () {
    console.log(" BlockChain Server is running on Port: " + PORT);
});

