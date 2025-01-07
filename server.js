const express = require('express');
const server = express();
const helmet=require('helmet');
const port = process.env.PORT || 3000;
const viewhomepage=require('./routes/home')
const viewuser = require('./routes/user');
server.use(express.json());
server.use(helmet());
server.use('/',viewhomepage);
server.use('/users', viewuser);
server.all('*', (req, res) => {
    res.status(404).send('error! content is not available');
});
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
module.exports=server;
