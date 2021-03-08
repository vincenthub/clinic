const bycrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const UserInfoModel = require('../mongo_models/users/UserInfo');
const AddressInfoModel = require('../mongo_models/users/AddressInfo');
const { USER_GROUP, RECORD_STATUS } = require('../utilities/config');

exports.register = async (req, res) => {
    //save it to mongodb
    try {
        //validation check for params
        const errors = validationResult(req)
        if(!errors.isEmpty()) return res.status(400).json({ error: errors.array() })

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
        if(findUser) return res.status(400).json({ message: 'Invalid email!'});
        
        //hash user password
        const salt = await bycrypt.genSalt(10)
        const hashedPassword = await bycrypt.hash(password, salt)

        const AddressInfo = await new AddressInfoModel({
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
        }).save();

        if (AddressInfo) {
            //create a new user model
            const UserInfo = await new UserInfoModel({
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
            }).save();

            if (UserInfo) {
                await AddressInfoModel.findOneAndUpdate( { _id: AddressInfo.id }, { address_create_by_user_id: UserInfo.id }, { upsert: true } );
                await UserInfoModel.findOneAndUpdate( { _id: UserInfo.id }, { user_create_by_user_id: UserInfo.id }, { upsert: true } );

                const  payload = {
                    id: UserInfo.id,
                }

                //jwt sign
                jwt.sign(
                    payload,
                    process.env.TOKEN_SECRET,
                    { expiresIn: 360000 },
                    (err, token) => {
                        if(err) throw err;
                        res.status(200).json({
                            user: payload,
                            token
                        })
                    }
                )
            }
        }



    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Unable to save user!' });
    }
}

exports.login = async (req, res) => {
    //check from mongodb
    try {
        
        //validate request body
        const errors = validationResult(req)
        if(!errors.isEmpty()) return res.status(400).json({ error: errors.array() })

        const { email, password } = req.body;

        //check user exist
        const findUser = await UserInfoModel.findOne({ user_email: email });

        //check and compare password
        const isPassMatch = await bycrypt.compare(password, findUser.user_password);

        if(!findUser || findUser.user_create_status !== RECORD_STATUS.ACTIVE  || !isPassMatch) return res.status(400).json({ message: 'Incorrect email or password!' });
        
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
                    res.status(200).json({
                        user: payload,
                        token
                   })
                }
            }
        )

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server Error!' })
    }
}


//post update user status 
exports.updateUserStatus = async (req, res) => {
    //get it from mongodb
    try {
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