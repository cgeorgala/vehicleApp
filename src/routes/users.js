const express = require('express');
const router = express.Router();

//Register handling
router.post('/addUser',(req,res)=>
{
    console.log(`Login POST handling`);
});

//Login handling
router.get('/loginUser',(req,res)=>
{
    console.log(`Login GET handling`);
    res.render('login');
    //getPassByUsername
});

//Register handling
router.get('/addUser',(req,res)=>
{
    console.log(`Register GET handling`);
    res.render('register')
});

//Login handling
router.post('/loginUser',(req,res,next)=>
{
    console.log(`Register POST handling`);
});

//Logout handling
router.get('/logoutUser',(req,res)=>
{
    console.log(`Logout GET handling`);
    res.send(`Logout user from vehicleTransferApp!`);
});

module.exports  = router;