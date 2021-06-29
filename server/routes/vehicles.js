const express = require('express');
const router = express.Router();
const db = require('../controllers/vehiclesController');

// Endpoint is not used directly. Add vehicle through applications.
router.post('/addVehicle',(req,res)=>
{
    console.log(`You shouldn't use /addVehicle!`);
});


// Endpoint is not used directly. Finding vehicle through applications.
router.get('/findVehicle',(req,res)=>
{
    console.log(`You shouldn't use /findVehicle!`);
    db.getVehiclebyNum(req.body.vehicleNum,
        (err,data) => {
        if (err) {
            return res.json({ "Failed to find vehicle, with error" : err.detail });
        }
        else{
            if (data.rows.length > 0){
                return res.json({"Find vehicle successfully with id": data.rows[0].id});
            }else{
                return res.json("Vehicle number not found in DB!");
            }
        }
    });
});

// Endpoint is not used directly. Modify vehicle through applications.
router.put('/editVehicle',(req,res)=>
{
    console.log(`You shouldn't use /editVehicle!`);
    vehId = req.body.vehicle_id;
    db.updateVehicle(req, vehId,
        (err,data) => {
        if (err) {
            return res.json({ "Failed to edit vehicle, with error" : err.detail });
        }
        else{
            return res.json({"Edit vehicle successfully with id": vehId});
        }
    });
});

module.exports  = router;