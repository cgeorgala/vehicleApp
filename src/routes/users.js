const express = require('express');
const router = express.Router();
const db = require('../controllers/usersController');

//Register handling
router.post('/addUser',(req,res)=>
{
    console.log(`Register new user!`); 
    db.postNewUser(req,
        (err,data) => {
            if (err) {
                return res.json({ "Failed to add new user, with error" : err.detail });
            }
            else {
                return res.json({ "User added successfully, with user id" : data });
            }
    });
});

//Login handling
router.get('/loginUser',(req,res)=>
{
    console.log(`Login user!`);
    // res.render('login');
    db.getPassByUsername(req,
        (err,data) => {
            if (err) {
                return res.json({ "Failed to login, with error" : err.detail });
            }
            else{
                if (data.status == 200)
                {
                    return res.json("User login successfully");
                }
                else if (data.status == 404)
                {
                    return res.json("User login failed: wrong password");
                }
                else{
                    return res.json("User doesn't exist");
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