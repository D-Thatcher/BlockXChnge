
Let's get started by installing the necessary dependencies:

If you intend to host your database locally, you will also require mongod, which is included in the MongoDB system (https://docs.mongodb.com/manual/installation/).<br>

Also, if you don't already have Node.js, you can install it here (https://nodejs.org/en/download/).<br>

The rest of the dependencies can be installed by running:

### `npm install`

Open a terminal and run 

### `mongod`

Presently, there three separate databases; one for the user credentials and information (credentials), another for storing the minimal information necessary for the block chain (blockchain), and one for storing block information (blockinfochain).<br>

The corresponding servers can be started by opening terminals in src/backend and running `nodemon credentialServer.js`, 
`nodemon blockServer.js` and `nodemon blockInfoServer.js`, respectively. This can be refactored to run concurrently in production.

Finally, run 

### `npm start`

to start the local development server (http://localhost:3000).
