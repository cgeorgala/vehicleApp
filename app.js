process.title = 'vehicle_backend';
const express = require('express');
// const mongoose = require('mongoose');
const expressEjsLayout = require('express-ejs-layouts')
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const applicationsSchema = require('./src/models/applicationsModel');
const usersSchema = require('./src/models/usersModel');
const vehiclesSchema = require('./src/models/vehiclesModel');

const router = express.Router();
const app = express();
const PORT = 8000;

// Create schema for each table of db
// const User = mongoose.model('User', usersSchema);
// const Application = mongoose.model('Application', applicationsSchema);
// const Vehicle = mongoose.model('Vehicle', vehiclesSchema);

// Set mongo connection
// mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost/vehicleTranfer', {
//     useNewUrlParser:true,
//     useUnifiedTopology:true
// })
// .then(() => console.log('Connected to mongodb...'))
// .catch((err)=> console.log(err));

//Setup EJS
global.__basedir = __dirname;
app.set('views', __basedir + '/src/views');
app.set('view engine','ejs');
app.use(expressEjsLayout);

// Setup bodyparser
app.use(express.urlencoded({extended:false})); //TODO: extended true or false?
app.use(express.json());

//Configure to run frontend from localhost
// const cors = require('cors');
// app.use(cors());
// app.use(express.static('public'));

//Routes
app.use('/', require('./src/routes/index'));
app.use('/users', require('./src/routes/users'));
app.use('/applications', require('./src/routes/applications'));
app.use('/vehicles', require('./src/routes/vehicles'));

// Swagger
app.use(
    '/api-docs',
    swaggerUi.serve, 
    swaggerUi.setup(swaggerDocument)
);

app.listen(PORT, () => 
{
    console.log(`Your server is running on port ${PORT}`);
});