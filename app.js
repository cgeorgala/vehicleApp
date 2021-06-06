process.title = 'vehicle_backend';
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const pg = require('pg');

// Project configuration
const config = require('./src/config.json');

const router = express.Router();
const app = express();
const PORT = 8000;

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