const express = require('express');
const router = express.Router();

//Register user

router.post('/', (req, res) => {
    console.log(req.body);
    res.send('Users route');
});

module.exports = router;