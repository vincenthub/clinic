const ClinicDetailsModel = require('../mongo_models/clinics/ClinicInfo');
const ClinicDoctorModel = require('../mongo_models/clinics/doctorDetails');
const ClinicDoctorTitleModel = require('../mongo_models/clinics/doctorTitle');
const ClinicAddressModel = require('../mongo_models/users/AddressInfo');
const ClinicScheduleModel = require('../mongo_models/clinics/ClinicSchedule');
const ClinicTypeModel = require('../mongo_models/clinics/ClinicType');
const ClinicServiceModel = require('../mongo_models/clinics/ClinicService');
const UserModel = require('../mongo_models/users/UserInfo');

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

const getClinicDoctor = (doctorId) => {
    const findDoctor = ClinicDoctorModel.findById({ _id: doctorId });
    if(findDoctor){
        const findDoctorTitle = ClinicDoctorTitleModel.findById({ _id:findDoctor.doctorTitle })
        if(findDoctorTitle){
            return {
                doctorName: findDoctor.doctorName,
                doctorTitle: findDoctorTitle.dTitleName
            }
        }else{
            return null
        }
        
    }
    else return null
}

const getClinicType = (clinicType_id) => {
    const findType = ClinicTypeModel.findById({ _id: clinicType_id});
    if(findType) return findType
    else return null;
}

const getClinicAddress = (address_id) => {
    const findAddress = ClinicAddressModel.findById({ _id: address_id});
    if(findAddress) return findAddress
    else return null;
}

//SETTER functions will return ID's

const setClinicType = async (clinicType) => {
    try {
         //create a new clinic type with model
        const createClinicType = new ClinicTypeModel({
            cTypeName: clinicType,
        });
        //save clinic type
        const savedClinicType =  await createClinicType.save();
        console.log(savedClinicType)
        if(savedClinicType) return savedClinicType.id;    
        else return null
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Unable to create clinic type!' });
    }
  
}

const setClinicDoctor = async (clinicDoctor) => {
    try {
         //create a new clinic doctor title with model
         const createClinicDocTitle = new ClinicDoctorTitleModel({
            dTitleName: clinicDoctor.doctorTitle,
        });
         //save clinic doctorTitle
        const savedClinicDocTitle =  createClinicDocTitle.save();
        if(savedClinicDocTitle) {
            //save clinic doctor with model
            const createClinicDoctor = new ClinicDoctorModel({
                doctorName: clinicDoctor.doctorName,
                doctorTitleId: savedClinicDocTitle._id
            });
            //save clinic type
            const savedClinicDoctor = createClinicDoctor.save();
            if(savedClinicDoctor) return savedClinicDoctor._id;    
        } else return null

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Unable to create clinic doctor' });
    }
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
            cClinicTypeId: setClinicType(clinicInfo.clinicType), // { name }
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