const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const { INTERNAL_SERVER_ERROR, REQUEST_OK } = require('../utilities/ResponseHelper/HttpResponseCodes')
const { EndpointKeyPair } = require("../utilities/ResponseHelper/EndpointKeyPair");
const { HttpUnprocessedRequest, HttpBadRequest, HttpInternalServerError } = require("../utilities/ResponseHelper/ErrorDetail");
const AdminInfoModel = require('../mongo_models/users/AdminInfo');
const { ResponseHelper, AuthGenerators, sendEmail } = require('../utilities');
const { SuccessResponse, ErrorResponse } = ResponseHelper;
const { generateRandomPassword, generateExpiryDate } = AuthGenerators;

exports.createAdmin = async (req,res) => {

    try {

        const validationErrors = validationResult(req);
        if ( ! validationErrors.isEmpty() ) throw new HttpUnprocessedRequest('ADMIN001/1', validationErrors.array());

        const { email, firstName, lastName } = req.body;

        const foundAccount = await AdminInfoModel.findOne( { admin_email : email } );
        // TODO: change error as code
        if ( foundAccount ) throw new HttpBadRequest( 'ADMIN001/2', 'ACCOUNT_EXISTS');

        const salt = await bcrypt.genSalt(10);
        const password = generateRandomPassword();
        const hashedPassword = await bcrypt.hash(password, salt);
        const passwordExpireDate = generateExpiryDate(12);

        const AdminInfo  = await AdminInfoModel.create([{
            admin_email: email,
            admin_password: hashedPassword,
            admin_first_name: firstName,
            admin_last_name: lastName,
            admin_is_temp_password: true,
            admin_password_expiry_date: passwordExpireDate
        }]);

        if ( AdminInfo ) {

            const sentEmail = await sendEmail( email,
                'NewAdminAccountWithTempPassword',
                { email: email, name: `${firstName} ${lastName}`, password: password } );
            if ( sentEmail !== true ) throw new HttpInternalServerError('ADMIN001/3', 'EMAIL_COULD_NOT_SEND')

        }

        return res.status(REQUEST_OK).json( SuccessResponse(EndpointKeyPair.createAdmin, { email }));

    } catch ( error ) {

        return res.status(error.statusCode || INTERNAL_SERVER_ERROR).json( ErrorResponse( EndpointKeyPair.createAdmin, error ));

    }
};

