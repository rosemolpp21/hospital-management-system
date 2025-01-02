const express = require('express');
const router = express.Router();
const mysqlconnect=require('../config/db-connect');
router.get('/', (req, res) => {
    mysqlconnect.query('SELECT * FROM doctor',(err,results)=>{
        if(err){
            console.log('error occurred')
        }
        else{
            res.send(results);
        }
    })
});
module.exports = router;