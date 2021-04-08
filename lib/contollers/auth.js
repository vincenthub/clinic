const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const UserInfoModel = require('../mongo_models/users/UserInfo');
const AddressInfoModel = require('../mongo_models/users/AddressInfo');
const UnverifiedContactNumber = require('../mongo_models/UnverifiedContactNumber/UnverifiedContactNumber');
const { USER_GROUP, RECORD_STATUS } = require('../utilities/config');
const { sendSMS } = require('../utilities/SMSHelper');
const { SuccessResponse, ErrorResponse } = require('../utilities/ResponseHelper/ResponseHelper');
const { EndpointKeyPair } = require("../utilities/ResponseHelper/EndpointKeyPair");
const {HttpError, HttpUnprocessedRequest, HttpInternalServerError, HttpNotFound} = require("../utilities/ResponseHelper/ErrorDetail");
const { REQUEST_OK } = require('../utilities/ResponseHelper/HttpResponseCodes');



exports.sendSMSVerificationCode = async (req, res) => {

    try {

        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            throw new HttpUnprocessedRequest('AUTH001/1', validationErrors.array());
        }

        const findUser = await UserInfoModel.findOne({ user_contact_number: contactNumber });
        if ( findUser ) {
            throw new HttpError('AUTH001/2','ERROR_CONTACT_NUMBER_UNAVAILABLE');
        }

        const {contactNumber} = req.body;
        const codeGenerator = require('lodash');
        const verificationCode = codeGenerator.random(100000, 999999);

        if (process.env.SMS_TO_PHONE_NUMBER) {
            console.log('Verification Code: ' + verificationCode);
        }

        // Save/Update database
        const findContactNumber = await UnverifiedContactNumber.findOne({contact_number: contactNumber});
        if ( ! findContactNumber ) {
            // Insert
            await UnverifiedContactNumber.create({contact_number: contactNumber, verification_code: verificationCode});
        } else {
            // Update
            await UnverifiedContactNumber.findOneAndUpdate(
                {contact_number: contactNumber},
                {verification_code: verificationCode},
                {upsert: true});
        }

        // TODO: create languages for message:
        const sendSMSResult = await sendSMS( contactNumber, `Use verification code: ${verificationCode} for ClinicApp` );
        if (sendSMSResult !== true) {
            throw new HttpInternalServerError('AUTH001/3', sendSMSResult);
        }

        // Return OK
        res.status(REQUEST_OK).json( SuccessResponse( EndpointKeyPair.sendSMSVerificationCode, {contactNumber}) );

    } catch (error) {

        res.status(error.statusCode).json( ErrorResponse( EndpointKeyPair.sendSMSVerificationCode, error ) )
    }
}

exports.verifySMSVerificationCode = async (req, res) => {

    try {

        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            throw new HttpUnprocessedRequest('AUTH002/1', validationErrors.array());
        }
        const {contactNumber, verificationCode} = req.body;
        const findContactNumber = await UnverifiedContactNumber.findOne( { contact_number: contactNumber, verification_code: verificationCode } ).select('updatedAt');
        if (findContactNumber) {
            const currentts = Math.round(new Date().getTime() / 1000);
            const codets = Math.round(new Date(findContactNumber.updatedAt).getTime() / 1000);
            const diff = currentts - codets;
            if (diff <= 120) {
                res.status(REQUEST_OK).json( SuccessResponse(EndpointKeyPair.verifySMSVerificationCode, { verified: true, contactNumber }));
            } else {
                throw new HttpNotFound('AUTH002/2', 'VERIFICATION_CODE_EXPIRED');
            }
        } else {
            throw new HttpNotFound('AUTH002/3', 'NO_VALID_CODE');
        }
    } catch (error) {
        res.status(error.statusCode).json( ErrorResponse( EndpointKeyPair.verifySMSVerificationCode, error ) )
    }

}

exports.register = async (req, res) => {
    //save it to mongodb

    const registerApiFunction = 'registerAPI'
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        //validation check for params
        const errors = validationResult(req)
        if(!errors.isEmpty()) return ErrorResponse(res, registerApiFunction, UNPROCESS_REQUEST, errors.array())

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
        if(findUser) return ErrorResponse(res, registerApiFunction, BAD_REQUEST, USER_TAKEN)

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
                user_image: null,
                user_group: USER_GROUP.APP_USER,
                user_prefix: null,
                user_suffix: null,
                user_profession: null,
                user_address: AddressInfo.id,
                user_social_logins: null,
                // user_create_status: config.RECORD_STATUS.ACTIVE,
                user_create_by_user_id: null
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
                        return OkResponse(res, registerApiFunction, { token })
                    }
                )

                await session.commitTransaction();
                session.endSession();
            }
        }

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        ErrorResponse(res, registerApiFunction, INTERNAL_SERVER_ERROR, error.message)
    }
}

exports.login = async (req, res) => {

    const loginApiFunction = 'loginAPI'

    //check from mongodb
    try {
        //validate request body
        const errors = validationResult(req)
        if(!errors.isEmpty()) return ErrorResponse(res, loginApiFunction, BAD_REQUEST, errors.array())

        const { email, password } = req.body;

        //check user exist
        const findUser = await UserInfoModel.findOne({ user_email: email });

        //check and compare password
        const isPassMatch = findUser && await bcrypt.compare(password, findUser.user_password);

        if(!findUser || findUser.user_create_status !== RECORD_STATUS.ACTIVE) return ErrorResponse(res, loginApiFunction, BAD_REQUEST, WRONG_CREDENTIALS)

        //get user login attepmts
        const numberOfAttempts = findUser.user_login_attempts || 0;
        const attempts = 4;

        if(numberOfAttempts >= attempts) return ErrorResponse(res, loginApiFunction, BAD_REQUEST, ACCOUNT_LOCKED)

        if(!isPassMatch){
            await UserInfoModel.findOneAndUpdate(
                { _id: findUser.id },
                { user_login_attempts: numberOfAttempts + 1 },
                { upsert: true }
            )
            return ErrorResponse(res, loginApiFunction, BAD_REQUEST, WRONG_CREDENTIALS)
        }

        if(numberOfAttempts > 0){
            await UserInfoModel.findOneAndUpdate(
                { _id: findUser.id },
                { user_login_attempts: 0 },
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
                    return OkResponse(res, loginApiFunction, { token })
                }
            }
        )

    } catch (error) {
        console.log(error)
        ErrorResponse(res, loginApiFunction, INTERNAL_SERVER_ERROR, error.message)
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
