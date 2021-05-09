const {
    ClinicInfoModel,
    ClinicTypeModel,
    StaffInfoModel,
    AddressInfoModel
} = require('../mongo_models');
const {
    ResponseHelper,
    HttpResponseCodes,
    EndpointKeyPair,
    ConfigValues,
    ResponseDescriptionKeyPair,
    ErrorDetails  } = require('../utilities');
const {
    HttpInternalServerError,
    HttpUnprocessedRequest,
    HttpBadRequest
} = ErrorDetails;
const {
    INTERNAL_SERVER_ERROR,
    REQUEST_OK
} = HttpResponseCodes;
const {
    SuccessResponse,
    ErrorResponse
} = ResponseHelper;
const { validationResult } = require("express-validator");
const { sendEmail } = require('../utilities/EmailHelper');
const {
    EMAIL_COULD_NOT_SEND,
    CLINIC_NAME_ALREADY_EXISTS,
    STAFF_NOT_FOUND,
    STAFF_MULTI_CLINIC_NOT_ALLOWED,
    CLINIC_TYPE_NOT_FOUND,
    ERROR_REG_CLINIC,
    CLINIC_TYPE_NOT_CREATED,
    GET_ALL_CLINIC_TYPE_ERROR,
    FAILED_ADD_NEW_CLINIC_TYPE
} = ResponseDescriptionKeyPair;
const mongoose = require('mongoose');
const { RECORD_STATUS } = ConfigValues;


exports.registerClinic = async (req, res) => {
    try {
        const validationErrors = validationResult(req)
        if(!validationErrors.isEmpty()) throw new HttpUnprocessedRequest('REGCLINIC01/1', validationErrors.array());

        const {
            clinicName,
            shortDescription,
            clinicTypeId,
            staffId,
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
            longitude
        } = req.body;

        // Is there a clinic of the same clinic name?
        const cntExistingClinicName = await ClinicInfoModel
            .countDocuments({ 'clinic_name': clinicName } )

        if (cntExistingClinicName > 0) {
            throw new HttpUnprocessedRequest('REGCLINIC01/5', CLINIC_NAME_ALREADY_EXISTS);
        }

        // Is staff alive?
        const staff = await StaffInfoModel.findOne({ _id: staffId });

        if ( ! staff ) {
            throw new HttpUnprocessedRequest('REGCLINIC01/2', STAFF_NOT_FOUND);
        }

        // Is staff member of another clinic?
        const staffsExistingClinic = await ClinicInfoModel
            .findOne({ 'clinic_staffs': mongoose.Types.ObjectId(staffId) })
            .select('_id');

        if ( staffsExistingClinic ) {
            throw new HttpUnprocessedRequest('REGCLINIC01/4', STAFF_MULTI_CLINIC_NOT_ALLOWED)
        }

        // Is it a valid clinic type?
        const clinicType = await ClinicTypeModel.findOne( { _id: clinicTypeId});
        if ( ! clinicType ) {
             throw new HttpUnprocessedRequest('REGCLINIC01/3', CLINIC_TYPE_NOT_FOUND);
        }

        let clinicId = null;
        const session = await mongoose.startSession();
        session.startTransaction();

        const AddressInfo = await AddressInfoModel
            .create([{
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
                address_is_clinic: true,
                address_create_by_user_id: null
            }], { session });

        if (AddressInfo) {

            const ClinicInfo = await ClinicInfoModel
                .create([{
                    clinic_name: clinicName,
                    clinic_short_description: shortDescription,
                    clinic_staffs: staff.id,
                    clinic_address: AddressInfo.id,
                    clinic_types: clinicTypeId,
                    clinic_create_by_admin_id: req.user,
                }], { session });

            if (ClinicInfo) {
                clinicId = ClinicInfo[0].id;
                await AddressInfoModel
                    .findOneAndUpdate(
                        { _id: AddressInfo[0].id },
                        { address_create_by_user_id : req.user},
                        { upsert: true }
                    )
                    .session(session);
            }

        } else {

            throw new HttpInternalServerError('REGCLINIC01/4', ERROR_REG_CLINIC);
        }

        await session.commitTransaction();
        session.endSession();

        const sentEmail = await sendEmail( staff.staff_email,
            'NewClinicNotificationToFirstStaff',
            { clinic_name: clinicName, name: `${staff.staff_first_name} ${staff.staff_last_name}` } );
        if ( sentEmail !== true ) throw new HttpInternalServerError('STAFF000/3', EMAIL_COULD_NOT_SEND)

        return res.status(REQUEST_OK).send(SuccessResponse( EndpointKeyPair.registerClinic, { id: clinicId } ));

    } catch (error) {
        return res.status(error.statusCode || INTERNAL_SERVER_ERROR).json(ErrorResponse(EndpointKeyPair.registerClinic, error))
    }
}

exports.createClinicType = async (req, res) => {

    try {
        //check validation error
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) throw new HttpUnprocessedRequest('CLINICTYPE001/1', validationErrors.array());

        const {
            clinicTypeName,
            clinicTypeDescription
        } = req.body;

        //check for duplicates
        const foundClinicType = await ClinicTypeModel.findOne({ clinic_type_name: clinicTypeName });
        if(foundClinicType) throw new HttpBadRequest('CLINICTYPE001/2', FAILED_ADD_NEW_CLINIC_TYPE);

        //create a new clinic type model
        const clinicTypeInfo = await ClinicTypeModel.create([{
            clinic_type_name: clinicTypeName,
            clinic_type_description: clinicTypeDescription,
            clinic_type_create_by_user_id: req.user,
            clinic_type_create_status: RECORD_STATUS.ACTIVE
        }])

        if(!clinicTypeInfo) throw new HttpUnprocessedRequest('CLINICTYPE001/3', CLINIC_TYPE_NOT_CREATED);

        return res.status(REQUEST_OK).json(SuccessResponse(EndpointKeyPair.createClinicType, { clinicTypeId: clinicTypeInfo[0].id }));

    } catch (error) {

        return res.status(error.statusCode || INTERNAL_SERVER_ERROR).json( ErrorResponse( EndpointKeyPair.createClinicType, error ) )

    }

}

exports.systemClinicTypes = async (req, res) => {

    try {
        //check for validation error
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) throw new HttpUnprocessedRequest('CLINICTYPE003/1', validationErrors.array());

        const {
            clinicTypeId
        } = req.body;

        const searchField = clinicTypeId? { _id: clinicTypeId } : {}

        //get all system clinic types
        const systemClinicTypes = await ClinicTypeModel.find(searchField).select('_id clinic_type_name clinic_type_description clinic_type_create_status')

        if(!systemClinicTypes || systemClinicTypes.length === 0) throw new HttpUnprocessedRequest('CLINICTYPE002/1', GET_ALL_CLINIC_TYPE_ERROR);

        return res.status(REQUEST_OK).json(SuccessResponse(EndpointKeyPair.systemClinicType, systemClinicTypes));

    } catch (error) {

        return res.status(error.statusCode || INTERNAL_SERVER_ERROR).json( ErrorResponse( EndpointKeyPair.systemClinicType, error ) )

    }

}
