const express=require('express');
const router=express.Router();
const controller=require('../controller/authenticationcontroller');
router.get('/login',(req,res)=>{res.send('this is login page select /admin or /user')});
router.post('/login/admin',controller.loginadmin);
router.post('/login/user',controller.loginuser)
module.exports=router;