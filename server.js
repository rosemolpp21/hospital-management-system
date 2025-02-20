const express = require('express');
const server = express();
const bodyParser = require('body-parser');
const helmet=require('helmet');
const port = process.env.PORT || 8080;
const viewhomepage=require('./routes/home')
const viewuser = require('./routes/user');
const viewauthentication = require('./routes/authentication');
const signup=require('./routes/signup');
const login=require('./routes/login');
server.use(express.json());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(helmet());
server.use('/',viewhomepage);
server.use('/users', viewuser);
server.use('/', viewauthentication);
server.use('/',signup);
server.use('/',login);
server.all('*', (req, res) => {
    res.status(404).send('error! content is not available');
});
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
module.exports=server;
