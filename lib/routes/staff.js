const router = require('express').Router();
const { createStaff } =  require('../contollers/staff')
const { authenticationJWT } = require('./validationChecks/verifyToken')
const { createStaffCheck } = require('./validationChecks/createStaffCheck')

//@route    POST staff user details
//@desc     Create new staff details
//@access   Private
//@param        
router.post('/createStaff', createStaffCheck, authenticationJWT, createStaff);


module.exports = router;