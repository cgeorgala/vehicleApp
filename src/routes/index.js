const express = require('express');
const router  = express.Router();

//Login page
router.get('/', (req,res)=>
{
    console.log(`Welcome page`);
    res.render('welcome');
});

//Register page
router.get('/addUser', (req,res)=>
{
    console.log(`Register page`);
    res.render('register');
});

module.exports = router; 