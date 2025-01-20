const express=require('express');
const router=express.Router();
const authenticateadminoruser = require('../middleware/authenticateAdmin&user');
const controller=require('../controller/authenticationcontroller');
router.post('/bookappointment', authenticateadminoruser,controller.bookappointment);
router.post('/viewuserappointmentDetails', authenticateadminoruser,controller.viewuserappointmentDetails);
router.get('/viewallappointmentdetails', authenticateadminoruser,controller.viewappointmentdetails);
module.exports=router;