process.title = 'vehicle_backend';
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const pg = require('pg');

const bodyParser = require('body-parser');

// Project configuration
const config = require('./config/db-config.json');

const router = express.Router();
const app = express();
const PORT = 8000;



// parse application/json
// app.use(bodyParser.json())


//Configure to run frontend from localhost
const cors = require('cors');
app.use(cors());
// app.use(express.static('public'));

// Setup bodyparser
app.use(express.urlencoded({ extended: true })); //TODO: extended true or false?
app.use(express.json());

//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/applications', require('./routes/applications'));
app.use('/vehicles', require('./routes/vehicles'));

// Swagger
app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
);

app.listen(PORT, () => {
    console.log(`Your server is running on port ${PORT}`);
});