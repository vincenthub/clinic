const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

//@route    required al reutes
const authRoute = require('./lib/routes/auth');
const userRoute = require('./lib/routes/user');
const clinicRoute = require('./lib/routes/clinic');
const staffRoute = require('./lib/routes/staff')

//middleware
app.use(express.json());
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());

//router middlewares
// app.use('/', (req, res) => {
//     res.send("Hello Clinics!")
// })
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/user', userRoute);
app.use('/api/v1/staff', staffRoute);
app.use('/api/v1/clinic', clinicRoute);

module.exports = app;