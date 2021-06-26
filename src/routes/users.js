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
                console.log(data);
                return res.json( {"success": data} );
            }
    });
});

//Login handling
router.post('/loginUser',(req,res)=>
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
                    const user = data.rows[0];
                    console.log(user);
                    delete user.password;
                    return res.json(user);
                }
                else if (data.status == 404)
                {
                    return res.status(data.status).send({message:"User login failed: wrong password"});
                }
                else{
                    return res.status(data.status).send({message:"User doesn't exist"});
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