const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bycrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const appUserSchema = new Schema({
    email: {
        type: String,
        required: true,
        max: 255
    },
    password: {
        type: String,
        required: true,
        min: 8,
        max: 1024
    },
    permissionLevel: {
        type: Number,
        required: true,
        min: 1,
        max: 3
    },
    ownAClinic: {
        type: Boolean,
        required: true
    },
    socialLogin: {
        type: String,
        required: false,
    },
    userStatus: { //active or inactive
        type: Boolean,
        required: true
    }
},{ timestamps: true });


// appUserSchema.pre('save', async (next) => {
//     var user = this;
//     if(user.isModified('password')){
//         await bycrypt.genSalt(10, (err,salt)=>{
//             if(err) return next(err);

//             bycrypt.hash(user.password,10,(err,hash)=> {
//                 if(err) return next(err);
//                 user.password=hash;
//                 next();
//             })
//         })
//     }else{
//         next();
//     }
// });

// appUserSchema.methods.comparepassword = (password, cb) => {
//     bycrypt.compare(password, this.password, (err, isMatch) => {
//         if(err) return cb(next);
//         cb(null,isMatch);
//     });
// }

// appUserSchema.methods.generateToken = (cb) => {
//     var user = this;
//     var token = jwt.sign(user._id.toHexString,process.env.TOKEN_SECRET);
    
//     user.token = token;
//     user.save((err, user) => {
//         if(err) return cb(next);
//         cb(null, user)
//     })
// }

// appUserSchema.statics.findByToken = (token, cb) => {
//     var user = this;

//     jwt.verify(token, process.env.TOKEN_SECRET, (err, decode) => {
//         if(err) return cb(err);
//         cb(null,user);
//     })
// }

// appUserSchema.methods.deleteToken = (token, cb) => {
//     var user = this;

//     user.updateOne({$unset: { token :1 }}, (err, user)=> {
//         if(err) return cb(err);
//         cb(null, user)
//     })
// }


//note: modelname is saved to mongodb atlas
module.exports = mongoose.model('AppUsers', appUserSchema) //params: modelname, schema
