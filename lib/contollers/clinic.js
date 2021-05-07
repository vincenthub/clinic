const ClinicDetailsModel = require('../mongo_models/clinics/ClinicInfo');
const ClinicAddressModel = require('../mongo_models/users/AddressInfo');
const ClinicScheduleModel = require('../mongo_models/clinics/ClinicSchedule');
const ClinicServiceModel = require('../mongo_models/clinics/ClinicService');
const { ClinicTypeModel } = require('../mongo_models')
const { validationResult } = require('express-validator');
const { 
    ResponseHelper, 
    HttpResponseCodes, 
    EndpointKeyPair, 
    ConfigValues, 
    ResponseDescriptionKeyPair, 
    ErrorDetails 
} = require('../utilities');
const { 
    CLINIC_TYPE_NOT_CREATED, 
    CLINIC_TYPE_NOT_FOUND,
    GET_ALL_CLINIC_TYPE_ERROR, 
    FAILED_ADD_NEW_CLINIC_TYPE 
} = ResponseDescriptionKeyPair;
const { SuccessResponse, ErrorResponse } = ResponseHelper;
const { HttpUnprocessedRequest, HttpInternalServerError, HttpBadRequest} = ErrorDetails;
const { REQUEST_OK, INTERNAL_SERVER_ERROR } = HttpResponseCodes
const { RECORD_STATUS } = ConfigValues

//GETTER functions
const getClinicServices = (servicesIds) => {
    const getServices = [];
    servicesIds.forEach(sId => {
        const findService = ClinicServiceModel.findById({ _id: sId });
        if(findService) getServices.push(findService) ;
    });
    return getServices;
}

const getClinicSchedules = (scheduleIds) => {
    const getSchedules = [];
    scheduleIds.forEach(schdId => {
        const findSchedule = ClinicScheduleModel.findById({ _id: schdId });
        if(findSchedule) getSchedules.push(findSchedule) ;
    });
    return getSchedules;
}


const getClinicAddress = (address_id) => {
    const findAddress = ClinicAddressModel.findById({ _id: address_id});
    if(findAddress) return findAddress
    else return null;
}


const setClinicServices = async (services) => {
    try {
        
        const clinicServiceIds = []

        services.forEach(service => {
            //create a new service type with model
            const createClinicService = new ClinicServiceModel({
                cServiceName: service.serviceName,
                cServicePrice: service.price,
            });
            //save clinic services
            const savedClinicService = createClinicService.save();
            if(savedClinicService) clinicServiceIds.push(savedClinicService._id)
        })
        
        return clinicServiceIds

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Unable to create clinic services!' });
    }
  
}

const setClinicShcedules = async (schedules) => {
    try {
        const clinicScheduleIds = []
        schedules.forEach(schedule => {
            //create a new clinic schedule with model
            const createClinicSchedule = new ClinicSchedulModel({
                schedDay: schedule.day,
                schedStartTime: schedule.startTime,
                schedEndTime: schedule.endTime
            });
            //save clinic schedule
            const savedClinicSchedule= createClinicSchedule.save();
            if(savedClinicSchedule) clinicScheduleIds.push(savedClinicSchedule._id)
        })
        
        return clinicScheduleIds

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Unable to create clinic schedule!' });
    }
}

const setClinicAddress = async (addressDetails) => {
    try {
        const createClinicAddress = new ClinicAddressModel({
            adrsBuildingHouseNumber: addressDetails.houseNumber,
            adrsStreet: addressDetails.street,
            adrsBarangay: addressDetails.barangay,
            adrsCityTown: addressDetails.cityTown,
            adrsProvice: addressDetails.province,
            adrsPostalCode: addressDetails.postalCode,
            adrLatitude: addressDetails.latitude,
            adrLongitude: addressDetails.longitude
        });
        //save clinic schedule
        const savedClinicAddress= await createClinicAddress.save();
    
        if(savedClinicAddress) return savedClinicAddress._id 
        else return null

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Unable to create clinic services!' });
    }
}

//contollers
exports.clinicInfo = async (req, res) => {
    //get it from mongodb
    try {
        const { clinic_id } = req.body;

        //check clinic exist
        const findClinic = await ClinicDetailsModel.findOne({ _id: clinic_id });
        if(!findClinic) return res.status(400).json({ message: 'Clinic has no details'});

        //return selected fields
        const payload = {
            clinicType: getClinicType(findClinic.cClinicType),
            clinicServices: getClinicServices(findClinic.cServices),
            clinicDoctor: getClinicDoctor(findClinic.cDoctor),
            clinicAddress: getClinicAddress(findClinic.cAddress),
            clinicSchedules: getClinicSchedules(findClinic.cSchedules),
            clinicName: findClinic.cName,
            clinicAbout: findClinic.cAbout, 
            clinicMobile: findClinic.cMobile,
            clinicTelephone: findClinic.cTelephone
        }
        
        res.status(200).json(payload);

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server Error!' });
    }
}

exports.registerClinic = async (req, res) => {
    //save it to mongodb
    try {
        const { userID, clinicInfo } = req.body;

        //check user exist
        const findUser = await UserModel.findOne({ _id: userID });
        if(!findUser)return res.status(400).json({ message: 'User does not exists!'});
        
        //create a new clinic model
        const clinic = new ClinicDetailsModel({
            cUserID: userID,
            cClinicTypeId: null, // { name }
            cDoctorId: setClinicDoctor(clinicInfo.clinicDoctor), // { doctorName, doctorTitle }
            cServiceIds: setClinicServices(clinicInfo.clinicServices), //{ [{ cServiceName, cServicePrice }] }
            cAddressId: setClinicAddress(clinicInfo.clinicAddress), //{ adrsBuildingHouseNumber, adrsStreet, adrsBarangay, adrsCityTown, adrsProvice, adrsPostalCode, adrLatitude, adrLongitude }
            cScheduleIds: setClinicShcedules(clinicInfo.clinicSchedules),//{ [{ schedDay, schedStartTime, schedEndTime }] }
            cName: clinicInfo.clinicName,
            cAbout: clinicInfo.clinicAbout,
            cMobile: clinicInfo.clinicMobile,
            cTelephone: clinicInfo.clinicTelephone
        });

        //save appUser
        const savedClinic = await clinic.save();
        if(!savedClinic) return res.status(400).json({ message: 'Unable to create clinic' })
        res.status(200).json({ message: "Successfull added a clinic" })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server Error!' });
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