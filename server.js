const express = require('express');
const server = express();
const helmet=require('helmet');
const port = process.env.PORT || 3000;
const viewhomepage=require('./routes/home')
const viewdatabasetable=require('./routes/viewdata')
const viewabout = require('./routes/about');
const viewuser = require('./routes/user');
server.use(helmet());
server.use('/',viewhomepage);
server.use('/database',viewdatabasetable);
server.use('/about',viewabout);
server.use('/users', viewuser);
server.all('*', (req, res) => {
    res.status(404).send('error! content is not available');
  });
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
