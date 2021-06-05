const { response } = require('express');
const express = require('express');
const router = express.Router();
const a_db = require('../controllers/applicationsController');
const v_db = require('../controllers/vehiclesController');

// Create new vehicle
function setNewVehicle(request, callback)
{
    v_db.postNewVehicle(request,
        (err,data) => {
        if (err) {
            console.log("setNewVehicle: error");
            return callback(err, null);
        }
        else {
            console.log({"Vehicle added successfully with num": data});
            return callback(null, data);
        }
    });
}

function getNewVehicle(request, callback)
{
    v_db.getVehiclebyNum(request.body.vehicle_num,
        (err,data) => {
        if (err) {
            console.log("getNewVehicle: error");
            return callback(err, null);
        }
        else{
            console.log({"getNewVehicle success with num": data});
            return callback(null, data);
        }
    });
}

function addNewApplication(request, vehicleId, callback)
{
    //Add new application only when create vehicle is successful
    a_db.postNewApplication(request, vehicleId, 
        (err,result) => {
        if (err) {
            console.log("addNewApplication: error");
            return callback(err, null);
        }
        else {
            console.log("addNewApplication: success");
            return callback(null, result);
        }
    });
}

function createNewApplication(request,callback)
{
    setNewVehicle(request, 
    (err,resp) => {
        if (err) {
            console.log("setNewVehicle: error");
            return callback(err, null);
        }
        else {
            console.log({"Added in table, vehicle num=": resp});
            getNewVehicle(request, 
            (error,result) => {
                if (error) {
                    console.log("getNewVehicle: error");
                    // response.status = '400';
                    // response.error = err.detail;
                    return callback(error, null);
                }
                else{
                    console.log({"getNewVehicle success with num": result});
                    if (result.rows.length > 0)
                    {
                        vehicleId = result.rows[0].id;
                        console.log({"Find vehicle by num successfully with id":vehicleId});
                        addNewApplication(request, vehicleId,
                        (err,data) => {
                            if (err) {
                                console.log("addNewApplication: error");
                                // response.status = '400';
                                // response.error = err.detail;
                                return callback(err, null);
                            }
                            else {
                                console.log("addNewApplication: success");
                                response.status = '200';
                                return callback(null,response);
                            }
                        });
                    }else
                    {
                        console.log("Application failed: vehicle number not found in DB");
                        response.status = '404';
                        return callback(null,response);
                    }
                }
            });
        }
    });
}

//Applications handling
router.post('/addApplication',(req,res)=>
{
    console.log(`Start creating new application!`);
    createNewApplication(req,
    (err,resul) => {
        if (err) {
            console.log("addNewApplication: error");
            return res.status(400).json({ "Failed to add new application, with error" : err.detail });
        }
        else {
            console.log("addNewApplication: success");
            if (resul.status === '200'){
                return res.status(200).json({ "Application added successfully, for vehicle" : resul });
            }
            else{
                return res.status(404).json("New application failed: vehicle number not found in DB!");
            }
        }
    });
});

router.get('/findApplicationByStatus',(req,res)=>
{
    applStat = 'Pending'; // We want to get only Pending applications
    console.log(`Find application by status GET handling`);
    a_db.getApplByStatus( applStat,
        (err,data) => {
        if (err) {
            console.log("getNewVehicle: error");
            return res.status(400).json({ "Failed to find application, with error" : err.detail });
        }
        else{
            console.log({"getNewVehicle success with num": data});
            return res.status(200).json({"Application found successfully": data});
        }
    });
});

router.get('/findApplicationByUser',(req,res)=>
{
    console.log(`Find application by user GET handling`);
    a_db.getApplByUser( req.body.userId,
        (err,data) => {
        if (err) {
            console.log("getNewVehicle: error");
            return res.status(400).json({ "Failed to find application, with error" : err.detail });
        }
        else{
            console.log({"getNewVehicle success with num": data});
            if (data.length > 0){
                return res.status(200).json({"Application found successfully": data});
            }
            else{
                return res.status(404).json({"No application found for user": req.body.userId});
            }
        }
    });
});

router.put('/editAppication',(req,res)=>
{
    console.log(`Edit application PUT handling`);
});

module.exports  = router;