const bycrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator')
const UserModel = require('../mongo_models/users/appUser');
const UserDetailsModel = require('../mongo_models/users/userDetails');
const AppUserModel = require('../mongo_models/users/appUser')

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
            lastName, 
            mobileNumber,
            permissionLevel 
        } = req.body;

        //check user exist
        const findUser = await UserModel.findOne({ email });
        if(findUser) return res.status(400).json({ message: 'Invalid email!'});
        
        //hash user password
        const salt = await bycrypt.genSalt(10)
        const hashedPassword = await bycrypt.hash(password, salt)

        //create a new user model
        const appUser = new UserModel({
            email,
            password: hashedPassword,
            permissionLevel, /// 1: normal user, 2: clinic admin, 3: overall admin
            userStatus: true
        });

        //save appUser
        const savedUser = await appUser.save();

        if(savedUser){
            const userdetails = new UserDetailsModel({
                appUserID: savedUser.id, 
                firstName, 
                lastName, 
                mobileNumber, 
                address: null
            });
            //save user details
            await userdetails.save();
        }

        //jwt sign
        const  payload = {
            id: savedUser.id,
        }

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
        const findUser = await UserModel.findOne({ email });

        //check and compare password
        const isPassMatch = await bycrypt.compare(password, findUser.password);

        if(!findUser || !findUser.userStatus || !isPassMatch) return res.status(400).json({ message: 'Incorrect email or password!' });
        
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