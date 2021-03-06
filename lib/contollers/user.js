const UserDetailsModel = require('../mongo_models/users/userDetails');
const AppUserModel = require('../mongo_models/users/appUser')

//get user details
exports.me = async (req, res) => {
    //get it from mongodb
    try {
        const { id } = req.body;

        //check user exist
        const findUser = await await UserDetailsModel.findOne({ appUserID: id }).select("-appUserID");

        if(!findUser) return res.status(400).json({ message: 'User has no details'});
        
        //return selected fields
        const payload = {
            userDetailsID: findUser.id,
            firstName: findUser.firstName,
            lastName: findUser.lastName,
            mobileNumber: findUser.mobileNumber,
            address: findUser.address
        }
        
        res.status(200).json({ user: findUser });

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Unable to get user!' });
    }
}

//get all appusers
exports.allAppUsers = async (req, res) => {
    //get it from mongodb
    try {
        const allUsers = await AppUserModel.find({}).select('-password');

        var userMap = []
        if(allUsers){
            allUsers.forEach((user) => {
                userMap.push(user)
            })
        }
        
        res.status(200).json({ users: userMap });

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Unable to get user!' });
    }
}

//find one user
exports.searchAppUser = async (req, res) => {
    try {
        const { email } = req.body

        const findUser = await AppUserModel.findOne({ email })
        if(!findUser) return res.status(400).json({ message: "User does not exist!"})

        const getDetails = await UserDetailsModel.findOne({ appUserID: findUser.id})
        if(getDetails){
            var payload = {
                id: findUser.id,
                firstName: getDetails.firstName,
                lastName: getDetails.lastName
            }
            return res.status(200).json({ user: payload})
        }
        
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error!' });
    }
}

