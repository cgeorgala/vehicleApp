const e = require('express');
const express = require('express');
const router = express.Router();
const db = require('../controllers/vehiclesController');

// Vehicles handling
router.post('/addVehicle',(req,res)=>
{
    console.log(`Vehicle POST handling`);
});


// This is not actually used as endpoint
router.get('/findVehicle',(req,res)=>
{
    // res.send(`Find vehicle in vehicleTransferApp!`);
    console.log(`Find vehicle GET handling!`);
    db.getVehiclebyNum(req.body.vehicleNum,
        (err,data) => {
        if (err) {
            return res.status(400).json({ "Failed to find vehicle, with error" : err.detail });
        }
        else{
            if (data.length > 0){
                return res.status(200).json({"Find vehicle successfully with id": data.rows[0].id});
            }else{
                return res.status(404).json("Vehicle number not found in DB!");
            }
        }
    });
});

router.put('/editVehicle',(req,res)=>
{
    console.log(`Vehicle PUT handling`);
});

module.exports  = router;