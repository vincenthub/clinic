const jwt = require('jsonwebtoken')

//middleware function to check token
exports.authenticationJWT =  async (req, res, next) => {
  // Gather the jwt access token from the request header
  const bearerHeader = req.headers['authorization']; //using Bearer token
  
  if (!bearerHeader) return res.status(401).json({ message: "Authorization denied!"}) // if there isn't any token
  
  try {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    const decodedToken = jwt.verify(bearerToken, process.env.TOKEN_SECRET)
    req.user = decodedToken.user
    next() // pass the execution off to whatever request the client intended
  } catch (error) {
    res.status(401).json({ message: "Token is not valid"})
  }
  
}
