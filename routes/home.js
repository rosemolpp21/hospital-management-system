const express=require('express');
const router=express.Router();
router.get('/',(req,res)=>{
    res.send(`this is my home page <br>type /database to view database table <br> type /about to go to about page <br> type /users to go to user page`)
})
module.exports=router;