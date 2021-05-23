const express = require('express');
const router = express.Router();

//Applications handling
router.post('/addApplication',(req,res)=>
{
    console.log(`Add application POST handling`);
});

router.get('/findApplicationByStatus',(req,res)=>
{
    console.log(`Find application by status GET handling`);
    res.send(`Find application by status in vehicleTransferApp!`);
    //getApplByStatus
});

router.get('/findApplicationByUser',(req,res)=>
{
    console.log(`Find application by user GET handling`);
    res.send(`Find application by user in vehicleTransferApp!`);
    //getApplByUser
});

router.put('/editAppication',(req,res)=>
{
    console.log(`Edit application PUT handling`);
});

module.exports  = router;