const express=require('express');
const router=express.Router();
router.get('/',(req,res)=>{
    res.send(`this is my home page`)
})
module.exports=router;