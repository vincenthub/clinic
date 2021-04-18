const jwt = require('jsonwebtoken');
const { ErrorResponse } = require('../../utilities/ResponseHelper');
const { HttpUnauthorizedAccess } = require('../../utilities/ResponseHelper/ErrorDetail');
const { EndpointKeyPair } = require('../../utilities/ResponseHelper/EndpointKeyPair')

//middleware function to check token
exports.authenticationJWT =  async (req, res, next) => {
  try {
    // Gather the jwt access token from the request header
    const bearerHeader = req.headers['authorization']; //using Bearer token
    
    if (!bearerHeader) throw new HttpUnauthorizedAccess('AUTH000/1',  "Authorization access denied!");

    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    const decodedToken = jwt.verify(bearerToken, process.env.TOKEN_SECRET, (err, decode) => {
      if(err) {
        throw new HttpUnauthorizedAccess('AUTH000/2', err);
      }
      return decode
    })
    req.user = decodedToken.id
    next() // pass the execution off to whatever request the client intended
    
  } catch (error) {
    res.status(error.statusCode).json( ErrorResponse( EndpointKeyPair.authenticationJWT, error ) )
  }
}
