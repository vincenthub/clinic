const router = require('express').Router();
const { me, allAppUsers, searchAppUser } =  require('../contollers/user')
const { authenticationJWT } = require('./validationChecks/verifyToken')
const { checking } = require('./validationChecks/searchCheck')

//@route    GET app user details
//@desc     Get current user details
//@access   Private
//@param    id      
router.get('/me', authenticationJWT, me);

//@route    GET all app user
//@desc     Get list of all app users
//@access   Private
//@param      
router.get('/allAppUsers', authenticationJWT, allAppUsers);

//@route    GET search an app user
//@desc     Get current user details
//@access   Private
//@param    email  
//@return   user id, user name
router.get('/searchAppUser',[authenticationJWT, checking], searchAppUser);

module.exports = router;