const jwt = require('jsonwebtoken');
const { ErrorResponse } = require('../../utilities/apiResponse');
const { UNAUTHORIZE_ACCESS_CODE, INTERNAL_SERVER_ERROR } = require('../../utilities/apiResponse/httpResponseCodes')
const { UNAUTHORIZE_ACCESS, UNKNOWN_ERROR } = require('../../utilities/apiResponse/responseCodes')

//middleware function to check token
exports.authenticationJWT =  async (req, res, next) => {
  const authJWTFunction = 'jwtFunction'
  try {
    // Gather the jwt access token from the request header
    const bearerHeader = req.headers['authorization']; //using Bearer token
    
    if (!bearerHeader) return ErrorResponse(res, authJWTFunction, UNAUTHORIZE_ACCESS_CODE, UNAUTHORIZE_ACCESS )

    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    const decodedToken = jwt.verify(bearerToken, process.env.TOKEN_SECRET)
    req.user = decodedToken.user
    next() // pass the execution off to whatever request the client intended
  } catch (error) {
    console.log(error.name)
    ErrorResponse(res, authJWTFunction, INTERNAL_SERVER_ERROR, error.message )
  }
}
