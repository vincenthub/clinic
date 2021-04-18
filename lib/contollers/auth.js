const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment-timezone');
const { validationResult } = require('express-validator');
const { AddressInfoModel, UserInfoModel, StaffInfoModel } = require('../mongo_models')
const UnverifiedContactNumber = require('../mongo_models/UnverifiedContactNumber/UnverifiedContactNumber');
const { RECORD_STATUS } = require('../utilities/config');
const { sendSMS } = require('../utilities/SMSHelper');
const { SuccessResponse, ErrorResponse } = require('../utilities/ResponseHelper');
const { USER_GROUP, RECORD_STATUS } = require('../utilities/config');
const { sendSMS, ResponseHelper } = require('../utilities');
const { EndpointKeyPair } = require("../utilities/ResponseHelper/EndpointKeyPair");
const { HttpUnprocessedRequest, HttpInternalServerError, HttpBadRequest} = require("../utilities/ResponseHelper/ErrorDetail");
const codeGenerator = require('lodash');
const { REQUEST_OK, INTERNAL_SERVER_ERROR } = require('../utilities/ResponseHelper/HttpResponseCodes');
const { generateCurrentDate } = require('../utilities/authGenerators');
const { FAILED_ADD_NEW_USER, INVALID_CREDENTIAL, ACCOUNT_LOCK } = require('../utilities/ResponseHelper/ResponseDescriptionKeyPair');
const { SuccessResponse, ErrorResponse } = ResponseHelper;

exports.sendSMSVerificationCode = async (req, res) => {

    try {

        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) throw new HttpUnprocessedRequest('AUTH001/1', validationErrors.array());

        const {contactNumber} = req.body;

        const foundUser = await UserInfoModel.findOne({ user_contact_number: contactNumber });
        if ( foundUser ) throw new HttpInternalServerError('AUTH001/2','ERROR_CONTACT_NUMBER_UNAVAILABLE');

        const verificationCode = codeGenerator.random(100000, 999999);

        if (process.env.SMS_TO_PHONE_NUMBER) {
            console.log('Verification Code: ' + verificationCode);
        }

        const updatedContactNumber = await UnverifiedContactNumber.findOneAndUpdate(
            {contact_number: contactNumber},
            {verification_code: verificationCode},
            {upsert: true});
        if ( ! updatedContactNumber ) {
            await UnverifiedContactNumber.create({contact_number: contactNumber, verification_code: verificationCode});
        }

        const sendSMSResult = await sendSMS( contactNumber, `Use verification code: ${verificationCode} for ClinicApp` );
        if (sendSMSResult !== true) throw new HttpInternalServerError('AUTH001/3', sendSMSResult);

        // Return OK
        res.status(REQUEST_OK).json( SuccessResponse( EndpointKeyPair.sendSMSVerificationCode, { contactNumber }) );

    } catch (error) {

        res.status( error.statusCode || INTERNAL_SERVER_ERROR ).json( ErrorResponse( EndpointKeyPair.sendSMSVerificationCode, error ) )

    }
}

exports.verifySMSVerificationCode = async (req, res) => {

    try {

        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            throw new HttpUnprocessedRequest('AUTH002/1', validationErrors.array());
        }

        const { contactNumber, verificationCode } = req.body;

        // Find contact number
        const foundContactNumber = await UnverifiedContactNumber.findOne({ contact_number: contactNumber, verification_code: verificationCode });
        if ( ! foundContactNumber)  throw new HttpInternalServerError('AUTH002/2', 'NO_VALID_CODE');

        // Get timestamp difference from `now`
        const timeDiff = Math.round((Date.now() - (new Date(foundContactNumber.updatedAt).getTime())) / 1000)

        // Delete the record
        await UnverifiedContactNumber.findByIdAndDelete(foundContactNumber.id);

        // Check 2-minute validity
        if (timeDiff > 120)  throw new HttpInternalServerError('AUTH002/3', 'VERIFICATION_CODE_EXPIRED');

        return res.status(REQUEST_OK).json(SuccessResponse(EndpointKeyPair.verifySMSVerificationCode, {contactNumber}));

    } catch (error) {

        return res.status(error.statusCode || INTERNAL_SERVER_ERROR).json( ErrorResponse( EndpointKeyPair.verifySMSVerificationCode, error ) )

    }

}

exports.register = async (req, res) => {
    //save it to mongodb

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        //validation check for params
        const validationErrors = validationResult(req)
        if(!validationErrors.isEmpty()) throw new HttpUnprocessedRequest('AUTH003/1', validationErrors.array());

        const {
            email,
            password,
            firstName,
            middleName,
            lastName,
            birthDate,
            buildingNo,
            street,
            barangay,
            municipality,
            city,
            province,
            country,
            countryCode,
            postal,
            latitude,
            longitude,
            contactNumber
        } = req.body;

        //check user exist
        const findUser = await UserInfoModel.findOne({ user_email: email });
        if(findUser) throw new HttpBadRequest('AUTH003/2', FAILED_ADD_NEW_USER );

        //hash user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const AddressInfo = await AddressInfoModel.create([{
            address_building_number: buildingNo,
            address_street_name: street,
            address_barangay: barangay,
            address_municipality: municipality,
            address_city: city,
            address_province: province,
            address_postal_code: postal,
            address_country_name: country,
            address_country_code: countryCode,
            address_latitude: latitude,
            address_longitude: longitude,
            // address_create_status: config.RECORD_STATUS.ACTIVE,
            address_create_by_user_id: null
        }], { session })

        if (AddressInfo) {
            //create a new user model
            const UserInfo = await UserInfoModel.create([{
                user_email: email,
                user_password: hashedPassword,
                user_first_name: firstName,
                user_middle_name: middleName,
                user_last_name: lastName,
                user_contact_number: contactNumber,
                user_birth_date: birthDate,
                user_address: AddressInfo.id
            }], { session })

            if (UserInfo) {

                await AddressInfoModel.findOneAndUpdate(
                    { _id: AddressInfo[0].id },
                    { address_create_by_user_id: UserInfo[0].id },
                    { upsert: true }
                ).session(session);

                await UserInfoModel.findOneAndUpdate(
                    { _id: UserInfo[0].id },
                    { user_create_by_user_id: UserInfo[0].id },
                    { upsert: true }
                ).session(session);

                const  payload = {
                    id: UserInfo[0].id,
                }

                //jwt sign
                jwt.sign(
                    payload,
                    process.env.TOKEN_SECRET,
                    { expiresIn: 360000 },
                    (err, token) => {
                        if(err) throw err;
                        return res.status(REQUEST_OK).json( SuccessResponse(EndpointKeyPair.register, { token }));
                    }
                )

                await session.commitTransaction();
                session.endSession();
            }
        }

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return res.status(error.statusCode || INTERNAL_SERVER_ERROR).json( ErrorResponse( EndpointKeyPair.register, error ))
    }
}

exports.login = async (req, res) => {

    //check from mongodb
    try {
        //validate request body
        const validationErrors = validationResult(req)
        if(!validationErrors.isEmpty()) throw new HttpUnprocessedRequest('AUTH004/1', validationErrors.array());

        const { email, password } = req.body;

        //check user exist
        const findUser = await UserInfoModel.findOne({ user_email: email });

        //check and compare password
        const isPassMatch = findUser && await bcrypt.compare(password, findUser.user_password);

        if(!findUser || findUser.user_create_status !== RECORD_STATUS.ACTIVE) throw new HttpBadRequest('AUTH004/2', INVALID_CREDENTIAL);

        //get user login attepmts
        const numberOfAttempts = findUser.user_login_attempts || 0;
        const attempts = 4;

        if(numberOfAttempts >= attempts) throw new HttpBadRequest('AUTH004/3', ACCOUNT_LOCK);

        if(!isPassMatch){
            await UserInfoModel.findOneAndUpdate(
                { _id: findUser.id },
                { user_login_attempts: numberOfAttempts + 1 },
                { upsert: true }
            )
            throw new HttpBadRequest('AUTH004/4', INVALID_CREDENTIAL);
        }

        if(numberOfAttempts >= 0){
            await UserInfoModel.findOneAndUpdate(
                { _id: findUser.id },
                {
                    user_login_attempts: 0,
                    staff_last_login_date: generateCurrentDate()
                },
                { upsert: true }
            )
        }

         //jwt sign
        const  payload = {
            id: findUser.id
        }

        jwt.sign(
            payload,
            process.env.TOKEN_SECRET,
            { expiresIn: 360000 },
            (err, token) => {
                if(err) throw err;
                if(token){
                    return res.status(REQUEST_OK).json( SuccessResponse(EndpointKeyPair.login, { token }));
                }
            }
        )

    } catch (error) {
        return res.status(error.statusCode || INTERNAL_SERVER_ERROR).json( ErrorResponse( EndpointKeyPair.login, error ) )
    }
}

exports.loginStaff = async (req, res) => {

    //check from mongodb
    try {
        //validate request body
        const validationErrors = validationResult(req)
        if(!validationErrors.isEmpty()) throw new HttpUnprocessedRequest('AUTH005/1', validationErrors.array());

        const { email, password } = req.body;

        //check user exist
        const findStaff = await StaffInfoModel.findOne({ staff_email: email });

        //check and compare password
        const isPassMatch = findStaff && await bcrypt.compare(password, findStaff.staff_password);

        if(!findStaff || findStaff.staff_create_status !== RECORD_STATUS.ACTIVE) throw new HttpBadRequest('AUTH005/2', INVALID_CREDENTIAL);

        //check if staff is in temp password
        const isTemporaryPassword = findStaff && findStaff.staff_is_temp_password;

        // Get timestamp difference from `now`
        const timeDiff = Math.round(((new Date(findStaff.staff_password_expiry_date).getTime()) - Date.now()) / 1000)

        //  console.log("TIME DIFFERENCE::" + timeDiff);
        if (timeDiff <= 0) throw new HttpUnprocessedRequest('AUTH005/3', TEMPORARY_PASSWORD_EXPIRED);

        //get user login attepmts
        const numberOfAttempts = findStaff.staff_login_attempts || 0;
        const attempts = 4;

        if(numberOfAttempts >= attempts) throw new HttpBadRequest('AUTH005/4', ACCOUNT_LOCK);

        if(!isPassMatch){
            await StaffInfoModel.findOneAndUpdate(
                { _id: findStaff.id },
                { staff_login_attempts: numberOfAttempts + 1 },
                { upsert: true }
            )
            throw new HttpBadRequest('AUTH005/5', INVALID_CREDENTIAL);
        }

        if(numberOfAttempts >= 0 ){
            await StaffInfoModel.findOneAndUpdate(
                { _id: findStaff.id },
                {
                    staff_login_attempts: 0,
                    staff_last_login_date: generateCurrentDate()
                },
                { upsert: true }
            )
        }

         //jwt sign
        const  payload = {
            id: findStaff.id
        }

        jwt.sign(
            payload,
            process.env.TOKEN_SECRET,
            { expiresIn: 360000 },
            (err, token) => {
                if(err) throw err;
                if(token){
                    return res.status(REQUEST_OK).json( SuccessResponse(EndpointKeyPair.loginStaff, {
                        token,
                        is_temp_password: isTemporaryPassword
                    }));
                }
            }
        )

    } catch (error) {
        return res.status(error.statusCode || INTERNAL_SERVER_ERROR).json( ErrorResponse( EndpointKeyPair.loginStaff, error ) )
    }
}
exports.loginAdmin = async (req,res) => {

    try {
        const validationErrors = validationResult(req);
        if ( ! validationErrors.isEmpty() ) throw new HttpUnprocessedRequest('AUTH006/1', validationErrors.array());

        jwt.sign(
            payload,
            process.env.TOKEN_SECRET,
            { expiresIn: 360000 },
            (err, token) => {
                if(err) throw err;
                if(token){
                    return res.status(REQUEST_OK).json( SuccessResponse(EndpointKeyPair.login, { token }));
                }
            }
        )


    } catch ( error ) {
        return res.status(error.statusCode || INTERNAL_SERVER_ERROR).json( ErrorResponse( EndpointKeyPair.loginAdmin, error ) )
    }

}

//post update user status
exports.updateUserStatus = async (req, res) => {
    //get it from mongodb
    try {
        //validate request body
        const errors = validationResult(req)
        if(!errors.isEmpty()) return res.status(400).json({ error: errors.array() })

        const { id, currentStatus } = req.body;

        //check user exist
        const findUser = await AppUserModel.findOne({ _id: id });

        if(!findUser) return res.status(400).json({ message: 'User Does not exist!'});

        if(currentStatus){
            findUser.updateOne({_id: id }, { $set: { userStatus: false }})
            .then(model => {
                return res.status(200).json({ message: "Successfully removing user" });
            })
            .catch(err => res.status(422).json(err));
            findUser.save()
        }else{
            findUser.updateOne({_id: id }, { $set: { userStatus: true }})
            .then(model => {
                return res.status(200).json({ message: "User activation successfull" });
            })
            .catch(err => res.status(422).json(err));
            findUser.save()
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Unable to get user!' });
    }
}
