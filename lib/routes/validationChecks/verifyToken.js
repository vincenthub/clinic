const jwt = require('jsonwebtoken');
const { UnauthorizeResponse } = require('../../utilities/apiResponse');
const { UNAUTHORIZE_ACCESS } = require('../../utilities/apiResponse/responeCodes')

//middleware function to check token
exports.authenticationJWT =  async (req, res, next) => {
  try {
    // Gather the jwt access token from the request header
    const bearerHeader = req.headers['authorization']; //using Bearer token
    
    if (!bearerHeader) UnauthorizeResponse(res, UNAUTHORIZE_ACCESS)

    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    const decodedToken = jwt.verify(bearerToken, process.env.TOKEN_SECRET)
    req.user = decodedToken.user
    next() // pass the execution off to whatever request the client intended
  } catch (error) {
    InternalServerErrorResponse(res,error.message)
  }
}
