const express = require('express');
const router = express.Router();
const controller=require('../controller/patientcontroller');
router.post('/',controller.addpatient);
router.put('/:id',controller.updatepatient);
router.delete('/:id',controller.deletepatient);
module.exports=router;
