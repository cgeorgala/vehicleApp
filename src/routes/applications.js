const express = require('express');
const router = express.Router();
const a_db = require('../controllers/applicationsController');
const v_db = require('../controllers/vehiclesController');

//Applications handling
router.post('/addApplication',(req,res)=>
{
    console.log(`Create vehicle entry before creating application!`);
    v_db.postNewVehicle(req,
        (err,data) => {
        if (err) {
            return res.status(400).json({ "Failed to add new vehicle, with error" : err.detail });
        }
        else {
            console.log({"Vehicle added successfully with num": data});
        }
    });
    console.log(`Vehicle GET id`);

    v_db.getVehiclebyNum(req.vehicle_num,
        (err,data) => {
            if (err) {
                return res.status(400).json({ "Failed to get vehicle, with error" : err.detail });
            }
            else{
                // return res.status(200).json({"Get vehicle number successfully with id": data});
                console.log({"Vehicle added successfully with num": data});
                
                console.log(`Add application POST handling`);
                //Add new application only when create vehicle is successful
                a_db.postNewApplication(req, data, (err,result) => {
                    if (err) {
                        return res.status(400).json({ "Failed to add new application, with error" : err.detail });
                    }
                    else {
                        return res.status(200).json({ "Application added successfully, for vehicle" : result });
                    }
                });
            }
    });
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