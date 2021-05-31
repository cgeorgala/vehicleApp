const express = require('express');
const router = express.Router();
const db = require('../controllers/usersController');

// We will use a generic user-facing error for database query issues
const GENERIC_BACKEND_EXTERNAL_ERROR = "There was a problem with the server.";

//Register handling
router.post('/addUser',(req,res)=>
{
    console.log(`Login POST handling`); 
    db.postNewUser(req,
        (err,data) => {
            if (err) {
                return res.status(400).json({ "Failed to add new user, with error" : err.detail });
            }
            else {
                return res.status(200).json({ "User added successfully, with user id" : data });
            }
    });
});

//Login handling
router.get('/loginUser',(req,res)=>
{
    console.log(`Login GET handling`);
    // res.render('login');
    db.getPassByUsername(req,
        (err,data) => {
            if (err) {
                return res.status(400).json({ "Failed to login, with error" : err.detail });
            }
            else{
                if (data.status == 200) {
                    return res.status(200).json("User login successfully");
                }else {
                    return res.status(404).json("User login failed: wrong password");
                }
            }
    });
});

//Logout handling
router.get('/logoutUser',(req,res)=>
{
    console.log(`Logout GET handling`);
    res.send(`Logout user from vehicleTransferApp!`);
});

module.exports  = router;