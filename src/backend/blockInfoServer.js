const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const blockRoutes = express.Router();
const PORT = 4001;

let Block = require('./blockinfochain.model');
//
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/blockinfochain', {useNewUrlParser: true});
const connection = mongoose.connection;

connection.once('open', function () {
    console.log("MongoDB database connection to blockinfochain established successfully");
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



blockRoutes.route('/add').post(function(req, res) {
    let block = new Block(req.body);
    block.save()
        .then(todo => {
            res.status(200).json({'Block': 'Block added successfully'});
        })
        .catch(err => {
            res.status(400).send('adding new Block failed');
        });
});


//

blockRoutes.route('/remove/:id').get(function(req, res) {

    Block.findById(req.params.id, function(err, block) {
        if (!block)
            res.status(404).send('block is not found');
        else {block.remove();}

    });
});

app.use('/blockinfochain', blockRoutes);

app.listen(PORT, function () {
    console.log(" BlockInfoChain Server is running on Port: " + PORT);
});

