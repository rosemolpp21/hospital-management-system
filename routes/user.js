const express = require('express');
const router = express.Router();
router.get('/', (req, res) => {
    res.send('This is the users page');
});
router.get('/:id',(req,res)=>{
   res.send(`this user with id ${req.params.id}`)
})
module.exports = router;
