
Let's get started by installing the necessary dependencies:

If you intend to host your database locally, you will also require mongod, which is included in the MongoDB system (https://docs.mongodb.com/manual/installation/).<br>

Also, if you don't already have Node.js, you can install it here (https://nodejs.org/en/download/).<br>

The rest of the dependencies can be installed by running:

### `npm install`

Open a terminal and run 

### `mongod`

Presently, there are three separate databases; one for the user credentials and information (credentials), another for storing the minimal information necessary for the block chain (blockchain), and one for storing block information (blockinfochain).<br>

The corresponding servers can be started by opening terminals in src/backend and running `nodemon credentialServer.js`, 
`nodemon blockServer.js` and `nodemon blockInfoServer.js`, respectively. This can be refactored to run concurrently in production.

Finally, run 

### `npm start`

to start the local development server (http://localhost:3000).

On the initial page, you can create an account, sign-in, or scroll down to learn about how the exchange works.<br>

![alt text](https://github.com/D-Thatcher/BlockXChnge/blob/master/sinup.PNG)

Scroll down, and you will see<br>

![alt text](https://github.com/D-Thatcher/BlockXChnge/blob/master/whatis.PNG)

Each account starts off with 2500 of paper currency, and users can deposit actual money to their account, which is handled through Stripe.

![alt text](https://github.com/D-Thatcher/BlockXChnge/blob/master/account.PNG)


Navigate to the Create Block tab, and you can set-up a contract to your preference. This contract will be made available to other BlockXChnge users. 

![alt text](https://github.com/D-Thatcher/BlockXChnge/blob/master/create.PNG)


You'll notice the available contract appear on your Home page (see Home tab). This is where other users can click and decide whether to join your block.

![alt text](https://github.com/D-Thatcher/BlockXChnge/blob/master/join.PNG)

Once the block is joined, you'll notice a new addition to the public block chain. The block's information (along with the previous block's hash) was hashed and is identifiable on the block chain via the block's summary.

![alt text](https://github.com/D-Thatcher/BlockXChnge/blob/master/hash.PNG)









