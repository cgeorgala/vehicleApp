// const { response } = require('express');
const express = require('express');
const router = express.Router();
const a_db = require('../controllers/applicationsController');
const v_db = require('../controllers/vehiclesController');

const fetch = require("node-fetch");
const { email }  = require('../config/mail-conf.json');

// Create new vehicle during creation of new application
function setNewVehicle(request, callback) {
    v_db.postNewVehicle(request,
        (err, data) => {
            if (err) {
                console.log("setNewVehicle: error");
                return callback(err, null);
            }
            else {
                console.log({ "setNewVehicle success": data });
                return callback(null, data);
            }
        });
}

//Retrieve vehicle information to be used in an application
function getVehicle(request, callback) {
    v_db.getVehiclebyNum(request.body.vehicle_num,
        (err, data) => {
            if (err) {
                console.log("getVehicle: error");
                return callback(err, null);
            }
            else {
                console.log({ "getVehicle success with num": data });
                return callback(null, data);
            }
        });
}

// Add new application in applications table
function addNewApplication(request, vehicleId, callback) {
    a_db.postNewApplication(request, vehicleId,
        (err, result) => {
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

// Create new application
function createNewApplication(request, callback) {
    //Use callbacks to be sure that each query is completed before making a new one
    setNewVehicle(request,
        (err, resp) => {
            if (err) {
                console.log("createNewApplication-setNewVehicle: error");
                return callback(err, null);
            }
            else {
                console.log({ "createNewApplication-setNewVehicle success num": resp });
                getVehicle(request,
                    (error, result) => {
                        if (error) {
                            console.log("createNewApplication-getNewVehicle: error");
                            return callback(error, null);
                        }
                        else {
                            console.log({ "createNewApplication-getVehicle success num": result });
                            if (result.rows.length > 0) {
                                vehicleId = result.rows[0].id;
                                console.log({ "createNewApplication-vehicle exists with id": vehicleId });
                                addNewApplication(request, vehicleId,
                                    (err, data) => {
                                        if (err) {
                                            console.log("createNewApplication-addNewApplication: error");
                                            return callback(err, null);
                                        }
                                        else {
                                            console.log("createNewApplication-addNewApplication: success");
                                            data.status = '200';
                                            console.log(data.rows);
                                            return callback(null, data);
                                        }
                                    });
                            } else {
                                console.log("createNewApplication fail: vehicle not found in DB");
                                result.status = '404';
                                return callback(null, result);
                            }
                        }
                    });
            }
        });
}

//Handling of new applications
router.post('/addApplication', (req, res) => {
    console.log(`Start creating new application!`);
    createNewApplication(req,
        (err, result) => {
            if (err) {
                console.log("addApplication: error");
                return res.status(400).send({ message: "Failed to add new application, with error" + err.detail });
            }
            else {
                console.log("addApplication: success");
                if (result.status === '200') {
                    // return res.send(`Application added successfully, for vehicle ${result}`);
                    return res.json(result.rows[0]);
                }
                else {
                    return res.status(400).send({ message: "New application failed: vehicle number not found in DB!" });
                }
            }
        });
});

// Find applications that are pending for approval
router.get('/findApplicationByStatus', (req, res) => {
    applStat = 'Pending';
    console.log(`Find application by status GET handling`);
    a_db.getApplByStatus(applStat,
        (err, data) => {
            if (err) {
                console.log("getApplByStatus: error");
                return res.status(400).send({ message: "Failed to find pending applications, with error" + err.detail });
            }
            else {
                console.log({ "getApplByStatus success with num": data });
                return res.json(data);
            }
        });
});

router.get('/findApplicationById/:id', (req, res) => {
    console.log(`Find application by id ${req.params.id}`);
    a_db.getApplById(req.params.id,
        (err, data) => {
            if (err) {
                return res.status(400).send({ message: "Failed to find application, with error" + err.detail });
            }
            else {
                if (data.length > 0) {
                    return res.json(data[0]);
                }
                else {
                    return res.status(400).send({ message: "No application found for id" + req.params.id });
                }
            }
        });
});

router.get('/findApplicationByUser/:userId', (req, res) => {
    console.log(`Find application by user ${req.params.userId}`);
    a_db.getApplByUser(req.params.userId,
        (err, data) => {
            if (err) {
                console.log("getApplByUser: error");
                return res.status(400).send({ message: "Failed to find application, with error" + err.detail });
            }
            else {
                console.log({ "getApplByUser success with num": data });
                if (data.length > 0) {
                    return res.json(data);
                }
                else {
                    return res.status(400).send({ message: "No application found for user" + req.params.userId });
                }
            }
        });
});

function editApplication(request, callback) {
    a_db.getVehicleIdByApplicationId(request,
        (error, result) => {
            if (error) {
                console.log("editApplication:getVehicleIdByApplId: error");
                return callback(error, null);
            }
            else {
                if (result.length > 0) {
                    //Check that application status is NOT completed before updating
                    if (result[0].applStatus !== 'Completed') {
                        console.log({ "editApplication: getVehicleIdByApplId success with id": (result[0].vehicleId, result[0].applId) });
                        v_db.getVehiclebyId(result[0].vehicleId,
                            (error, vdata) => {
                                if (error) {
                                    console.log("editApplication:getVehiclebyId: error");
                                    return callback(error, null);
                                }
                                else {
                                    if (vdata.length > 0) {
                                        console.log({ "editApplication: getVehiclebyId success with id": vdata[0].id });
                                        // TODO check values of request and result(from vehicle table)
                                        // Only if values are different, update.
                                        v_db.updateVehicle(request, vdata[0].id,
                                            (err, vresp) => {
                                                if (err) {
                                                    console.log("updateVehicle: error");
                                                    return callback(err, null);
                                                }
                                                else {
                                                    console.log({ "updateVehicle: added in table, vehicle num=": vresp });
                                                    a_db.editExistApplication(request,
                                                        (err, adata) => {
                                                            if (err) {
                                                                console.log("EditApplication: error");
                                                                return callback(err, null);
                                                            }
                                                            else {
                                                                console.log("EditApplication: success");
                                                                adata.status = '200';
                                                                return callback(null, adata);
                                                            }
                                                        });
                                                }
                                            });
                                    } else {
                                        console.log({ "No vehicle found for vehicle id": result[0].vehicleId });
                                        vdata.errCode = '3';
                                        vdata.errMsg = 'No vehicle found in table';
                                        return callback(null, vdata);
                                    }
                                }
                            });
                    } else {
                        console.log({ "Not allowed to edit completed application": request.body.appl_id });
                        result.errCode = '2';
                        result.errMsg = 'Not allowed to edit completed application';
                        return callback(null, result);
                    }
                } else {
                    console.log({ "No vehicle id for application id": request.body.appl_id });
                    result.errCode = '1';
                    result.errMsg = 'There is no vehicle id for application id';
                    return callback(null, result);
                }
            }
        });
}

router.put('/editApplication', (req, res) => {
    console.log(`Modify application handling`);
    editApplication(req,
        (err, adata) => {
            if (err) {
                console.log("editNewApplication: error");
                return res.status(400).send({ message: "Failed to edit application, with error" + err.detail });
            }
            else {
                console.log("editApplication: success");
                if (adata.status === '200') {
                    console.log(adata);
                    return res.json(adata.rows[0]);
                }
                else {
                    return res.status(400).send({ message: "Edit application failed, cause" + adata.errMsg });
                }
            }
        });
});

//Change application status, allowed values:In Progress, Pending, Completed, Rejected
function modifyApplicationStatus(request, callback) {
    console.log({ "modifyApplicationStatus: for applId=": request.body.applId });
    a_db.editApplicationStatus(request,
        (err, adata) => {
            if (err) {
                console.log("modifyApplicationStatus: error");
                return callback(err, null);
            }
            else {
                console.log("modifyApplicationStatus: success");
                return callback(null, adata);
            }
        });
}

// Function used to send POST request to mail server
async function sendMailNotificationReq( data ) {
    try {
        const mailInfo    = {};
        mailInfo['email']= data.userEmail;
        mailInfo['status']= data.status;
        mailInfo['vehicle']= data.vehicleNum;

        // Create Object to string
        let mailInfoBody = JSON.stringify( mailInfo );

        const requestOptions    = {};
        const mailPostUrl   = `http://${email.host}:5000/notifyUser`;
        requestOptions.method  = 'POST';
        requestOptions.headers = {'Content-Type':'application/json'};
        requestOptions.body = mailInfoBody;

        // Use fetch to access HTTP requests/responses
        const response = await fetch(mailPostUrl, requestOptions);
        // console.log(response);
        return response.status;
    }
    catch(err){
        console.error(err.message);
    }
}

// When application status change is successful, send email to user
function sendChangeStatusEmail(request)
{
    console.log({ "sendChangeStatusEmail: for applId=": request.body.applId });
    a_db.getEmailInfoByApplId(request.body.applId,
        (err, data) => {
            if (err) {
                console.log({"getEmailInfoByApplId: error ":err});
            }
            else {
                console.log("getEmailInfoByApplId: success");
                if (data.length > 0)
                {
                    console.log({ "sendChangeStatusEmail: get data=": data[0] });
                    sendMailNotificationReq(data[0])
                    .then(value => console.log({ "send email with status=": value}))
                    .catch (error => console.log({ "email not send with error=": error}));
                }
                else {
                    console.log("sendChangeStatusEmail: no available data");
                }
            }
        });
}

router.put('/editApplicationStatus', (req, res) => {
    console.log(`Edit application status`);
    modifyApplicationStatus(req,
        (err, data) => {
            if (err) {
                console.log("editApplicationStatus: error");
                return res.json({ "Failed to modify application status, with error": err.detail });
            }
            else {
                console.log("editApplicationStatus: success");
                // Send email to user
                sendChangeStatusEmail(req);
                return res.json({ "Application status modified successfully": data });
            }
        });
});



module.exports = router;