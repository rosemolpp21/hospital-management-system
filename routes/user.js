const authenticateAdmin=require('../middleware/authenticateAdmin&user')
const express = require('express');
const router = express.Router();
const controller=require('../controller/patientcontroller');
router.post('/',authenticateAdmin,controller.addpatient);
router.put('/:id',authenticateAdmin,controller.updatepatient);
router.delete('/:id',authenticateAdmin,controller.deletepatient);
module.exports=router;
