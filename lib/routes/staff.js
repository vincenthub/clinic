const router = require('express').Router();
const { createStaff, searchStaff } =  require('../contollers/staff')
const { authenticationJWT } = require('./validationChecks/verifyToken')
const { createStaffCheck } = require('./validationChecks/createStaffCheck')
const { searchStaffChecks } = require('./validationChecks/searchStaffCheck')

//@route    POST staff user details
//@desc     Create new staff details
//@access   Private
//@param        
router.post('/createStaff', authenticationJWT, createStaffCheck, createStaff);

//@route    POST search staff user
//@desc     Search staff details
//@access   Private
//@param        
router.post('/searchStaff', authenticationJWT, searchStaffChecks, searchStaff);


module.exports = router;