const express = require('express')
const app = express();

const swaggerUi = require('swagger-ui-express'),
swaggerDocument = require('./swagger.json');

app.get('/', (req, res) => {
res.send('Welcome to learn backend with express!')
});


app.use(
    '/api-docs',
    swaggerUi.serve, 
    swaggerUi.setup(swaggerDocument)
  );

app.listen(8000, () => {
console.log('Example app listening on port 8000!')
});