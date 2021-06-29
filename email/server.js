process.title = 'email_server';

const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

require('dotenv').config();

const app = express();
const PORT = 5000;

//Setup body parser
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//Configure to run frontend from localhost
const cors = require('cors');
app.use(cors());

// Create transporter object
let transporter = nodemailer.createTransport(
{
    service:'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

app.post('/notifyUser/', (req,res) =>
{
    if (req.body)
    {
        console.log(`Send email to user: ${req.body.email}`);
        let mail = req.body.email;
        let status = req.body.status;
        let veh_num = req.body.vehicle;
        let email_options = {
            from: 'vehicle.app.hua@gmail.com',
            to: `${mail}`,
            subject: 'Ενημέρωση για την αίτηση μεταβίβασης αυτοκινήτου',
            html: `<p>Αγαπητέ πολίτη, <br/><br/>
                      Η αίτηση μεταβίβασης του αυτοκινήτου με αριθμό κυκλοφορίας 
                      <i><b>${veh_num}<b></i>, άλλαξε κατάσταση και έγινε: 
                      <i><b>${status}</b></i> <br/><br/>
                      Εκ μέρους της ομάδας μεταβιβάσεων αυτοκινήτων
                    <p>`
        }
        // Send email
        transporter.sendMail(email_options, function(err,data)
        {
            if (err){
                console.log('Error occured!', err);
                res.status(400).send(`Error occured while sending to user: ${mail}`);
            }
            else{
                console.log('Email sent successfully!')
                res.status(200).send(`'Email sent successfully to: ${mail}`);
            }
        });
    }
    else{
        res.status(400).send(`Error! Requested email is empty: ${req}`);
    }
});

app.get('/', (req,res) =>
{
    console.log(`Nodemailer is up and running!`);
    res.send(`Nodemailer is running on port ${PORT}`);
}
);

app.listen(PORT, () => 
    console.log(`Nodemailer is running on port ${PORT}`)
);