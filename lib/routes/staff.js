const router = require('express').Router();
const { createStaff, searchStaff } =  require('../contollers/staff')
const { authenticationJWT } = require('./validationChecks/verifyToken')
const { createStaffCheck } = require('./validationChecks/createStaffCheck')
const { searchStaffChecks } = require('./validationChecks/searchStaffCheck')

//@route    POST staff user details
//@desc     Create new staff details
//@access   Private
//@param        
router.post('/createStaff', createStaffCheck, authenticationJWT, createStaff);

//@route    POST search staff user
//@desc     Search staff details
//@access   Private
//@param        
router.post('/searchStaff', searchStaffChecks, authenticationJWT, searchStaff);


module.exports = router;