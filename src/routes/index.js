const express = require('express');
const router  = express.Router();

//Home page
router.get('/', (req,res)=>
{
    console.log(`Welcome page`);
    // res.render('welcome');
    res.send(`Node and express server are running!`);
});

module.exports = router; 