const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const { StaffInfoModel } = require('../mongo_models')
const { INTERNAL_SERVER_ERROR, REQUEST_OK } = require('../utilities/ResponseHelper/HttpResponseCodes')
const { FAILED_ADD_NEW_STAFF, INVALID_EMAIL_ADDRESS } = require('../utilities/ResponseHelper/ResponseDescriptionKeyPair')
const { RECORD_STATUS } = require('../utilities/config');
const { EndpointKeyPair } = require("../utilities/ResponseHelper/EndpointKeyPair");
const { SuccessResponse, ErrorResponse } = require('../utilities/ResponseHelper');
const { HttpUnprocessedRequest, HttpBadRequest} = require("../utilities/ResponseHelper/ErrorDetail");
const { generateRandomPassword, generateExpiryDate } = require('../utilities/AuthGenerators');

exports.createStaff = async (req, res) => {
    //save it to mongodb
    try {
        //validation check for params
        const validationErrors = validationResult(req)
        if(!validationErrors.isEmpty()) throw new HttpUnprocessedRequest('STAFF000/1', validationErrors.array());

        const {
            email,
            firstName,
            middleName,
            lastName,
            birthDate,
            mobileNumber,
        } = req.body;

        //check staff exist
        const foundStaff = await StaffInfoModel.findOne({ staff_email: email });
        if(foundStaff) throw new HttpBadRequest('STAFF000/2', FAILED_ADD_NEW_STAFF);
        if(!foundStaff){

            //generate temporary password and hash the temporary password
            const salt = await bcrypt.genSalt(10)
            const tempPassword = generateRandomPassword(8);
            const hashedPassword = await bcrypt.hash(tempPassword, salt);
            const passwordExpires = generateExpiryDate(12) //param: how many day/s

            //create a new user model
            const StaffInfo = await StaffInfoModel.create([{
                staff_email: email,
                staff_password: hashedPassword,
                staff_first_name: firstName,
                staff_middle_name: middleName,
                staff_last_name: lastName,
                staff_contact_number: mobileNumber,
                staff_birth_date: birthDate,
                staff_password_expiry_date: passwordExpires, 
                staff_is_temp_password: true,
                staff_create_status: RECORD_STATUS.ACTIVE,
                staff_create_by_staff_id: req.user
            }])
            console.log(tempPassword)
            
            if(StaffInfo){
                //TO DO:: send email
                // Return ID
                res.status(REQUEST_OK).json( SuccessResponse( EndpointKeyPair.createStaff, { id: StaffInfo[0]._id }) );
            }
        }   

    } catch (error) {
        return res.status(error.statusCode || INTERNAL_SERVER_ERROR).json( ErrorResponse( EndpointKeyPair.createStaff, error ))
    }
}

exports.searchStaff = async (req, res) => {
    try {
        
        const validationErrors = validationResult(req)
        if(!validationErrors.isEmpty()) throw new HttpUnprocessedRequest('STAFF001/1', validationErrors.array());

        const {
            searchBody
        } = req.body;
        
        const searchValue = searchBody.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
        // console.log(searchValue)

        const foundStaff = await StaffInfoModel.aggregate([
            {   $match: { 
                    $or: [
                        { staff_email: { $regex: searchValue, $options: "i" } },
                        { staff_first_name: { $regex: searchValue, $options: "i" } },
                        { staff_last_name: { $regex: searchValue, $options: "i" } }
                    ] 
                }
            },
            {   $project: {
                    _id: 1,
                    'staff_email': 1,
                    'staff_first_name': 1,
                    'staff_last_name': 1,
                }
            },
            { $limit : 5 }
        ])
        
        if(foundStaff){
           return res.status(REQUEST_OK).json( SuccessResponse( EndpointKeyPair.searchStaff, foundStaff ) );
        }

    } catch (error) {
        return res.status(error.statusCode || INTERNAL_SERVER_ERROR).json( ErrorResponse( EndpointKeyPair.searchStaff, error ))
    }
}