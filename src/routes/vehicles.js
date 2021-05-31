const express = require('express');
const router = express.Router();
const db = require('../controllers/vehiclesController');

// Vehicles handling
router.post('/addVehicle',(req,res)=>
{
    console.log(`Vehicle POST handling`);
});

router.get('/findVehicle',(req,res)=>
{
    console.log(`Vehicle GET handling`);
    res.send(`Find vehicle in vehicleTransferApp!`);
    //getApplByVehicle
});

router.put('/editVehicle',(req,res)=>
{
    console.log(`Vehicle PUT handling`);
});

module.exports  = router;