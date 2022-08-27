const express = require('express');
var cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const swagger = require('express-swagger-generator')(app);
require('dotenv').config();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.raw());

const userRoute = require('./routes/user');
app.use('/auth',userRoute);

const itemRoutes = require('./routes/items');
app.use('/items',itemRoutes);
// app.use('api-docs',swagger(options));
app.listen(process.env.PORT, () => {
    console.log(`Application started on http://localhost:${process.env.PORT}`);
})