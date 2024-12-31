const express = require('express');
const server = express();
const port = process.env.PORT || 3000;
const viewhomepage=require('./routes/home')
const viewdatabasetable=require('./routes/viewdata')
const viewabout = require('./routes/about');
const viewuser = require('./routes/user');
server.use('/',viewhomepage);
server.use('/database',viewdatabasetable);
server.use('/about',viewabout);
server.use('/users', viewuser);
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
