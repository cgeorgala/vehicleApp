const express = require('express');
const router = express.Router();
const a_db = require('../controllers/applicationsController');
const v_db = require('../controllers/vehiclesController');

// Create new vehicle
function setNewVehicle(request)
{
    let retObj = {};
    v_db.postNewVehicle(request,
        (err,data) => {
        if (err) {
            retObj.error = 1; //err;
            retObj.data = {};
            console.log("setNewVehicle: error");
            // return res.status(400).json({ "Failed to add new vehicle, with error" : err.detail });
        }
        else {
            retObj.error = 2;
            retObj.data = data;
            console.log({"Vehicle added successfully with num": data});
        }
        return retObj;
    });
}

function getNewVehicle(request)
{
    let retObj = {};
    v_db.getVehiclebyNum(request.body.vehicle_num,
        (err,data) => {
        if (err) {
            retObj.error = 1; //= err;
            retObj.data = {};
            console.log("getNewVehicle: error");
            // return res.status(400).json({ "Failed to find vehicle by num, with error" : err.detail });
        }
        else{
            retObj.error = 2;
            retObj.data = data;
            console.log({"getNewVehicle success with num": data});
        }
        return retObj;
    });
}

function addNewApplication(request, vehicleId)
{
    let retObj = {};
    //Add new application only when create vehicle is successful
    a_db.postNewApplication(request, vehicleId, 
        (err,result) => {
        if (err) {
            retObj.error = err;
            retObj.result = {};
            console.log("addNewApplication: error");
            // return res.status(400).json({ "Failed to add new application, with error" : err.detail });
        }
        else {
            retObj.error = {};
            retObj.result = result;
            console.log("addNewApplication: success");
            // return res.status(200).json({ "Application added successfully, for vehicle" : result });
        }
        return retObj;
    });
}

async function createNewApplication(request)
{
    newVehObj = await setNewVehicle(request)
    .then( newVehicle => {
        if (newVehicle.error == 1) {
            return res.status(400).json({ "Failed to add new vehicle, with error" : newVehicle.error.detail });
        }
        else {
            console.log({"Vehicle added successfully with num": newVehicle.data});
        }
    })
    .catch(error => console.log("Catch setNewVehicle"));

    // if (newVehObj.error == 1) {
    //     return res.status(400).json({ "Failed to add new vehicle, with error" : newVehObj.error.detail });
    // }
    // else {
    //     console.log({"Vehicle added successfully with num": newVehObj.data});
    // }
    vehObj = await getNewVehicle(request);
    
    if (vehObj.data.length > 0)
    {
        console.log({"Find vehicle by num successfully with id": vehObj.data.rows[0].id});
        applObj = await addNewApplication(request, vehObj.data.rows[0].id);
        if (applObj.error) 
        {
            return res.status(400).json({ "Failed to create new application" : applObj.error.detail });
        }
        else{
            return res.status(201).json({ "Application added successfully, for vehicle" : applObj.result});
        }
    }else{
        return res.status(404).json("New application failed: vehicle number not found in DB!");
    }

}

//Applications handling
router.post('/addApplication',(req,res)=>
{
    console.log(`Start creating new application!`);
    res = createNewApplication(req);
    
    // v_db.postNewVehicle(req,
    //     (err,data) => {
    //     if (err) {
    //         return res.status(400).json({ "Failed to add new vehicle, with error" : err.detail });
    //     }
    //     else {
    //         console.log({"Vehicle added successfully with num": data});
    //     }
    // });
    // console.log(`Vehicle GET id`);

    // v_db.getVehiclebyNum(req.body.vehicle_num,
    //     (err,data) => {
    //     if (err) {
    //         return res.status(400).json({ "Failed to find vehicle by num, with error" : err.detail });
    //     }
    //     else{
    //         if (data.length > 0)
    //         {
    //             // req.send({"Find vehicle by num successfully with id": data.rows[0].id});
    //             // return res.status(200).json({"Get vehicle number successfully with id": data.rows[0].id});
    //             console.log({"Find vehicle by num successfully with id": data.rows[0].id});
    //             //Add new application only when create vehicle is successful
    //             a_db.postNewApplication(req, data.rows[0].id, 
    //                 (err,result) => {
    //                 if (err) {
    //                     return res.status(400).json({ "Failed to add new application, with error" : err.detail });
    //                 }
    //                 else {
    //                     return res.status(200).json({ "Application added successfully, for vehicle" : result });
    //                 }
    //             });
    //         }else{
    //             return res.status(404).json("New application failed: vehicle number not found in DB!");
    //         }
    //     }
    // });
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