const express = require('express');
const router = express.Router();
router.get('/', (req, res) => {
    res.send('This is my about page');
});
router.get('/new', (req, res) => {
    res.send('This is new in about page');
});
router.get('/new/hi', (req, res) => {
    res.send('This is new hi in about page');
});
module.exports = router;
