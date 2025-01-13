const express=require('express');
const router=express.Router();
const authenticateadminoruser = require('../middleware/authenticateAdmin&user');
const controller=require('../controller/authenticationcontroller');
router.post('/register',controller.register);
router.get('/register',(req,res)=>{res.send('this is register page give details to register')});
router.post('/register',);
router.get('/login',(req,res)=>{res.send('this is login page select /admin or /user')});
router.post('/login/admin',controller.loginadmin);
router.post('/login/user',controller.loginuser)
router.post('/bookappointment', authenticateadminoruser,controller.bookappointment);
router.post('/viewuserappointmentDetails', authenticateadminoruser,controller.viewuserappointmentDetails);
router.get('/viewallappointmentdetails', authenticateadminoruser,controller.viewappointmentdetails);
module.exports=router;