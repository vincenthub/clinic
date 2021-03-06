const app = require('./app_mongo');
const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config();
var PORT = process.env.PORT || 5000;

//connect DB
const mongoDb = process.env.DB_CONNECT;
mongoose.connect(
    mongoDb,
    { 
      useNewUrlParser: true, 
      useUnifiedTopology: true
    }
).then(() => {
  console.log("MongoDB Connected...");
  //start the server
  app.listen(PORT, function() {
    console.log(`Server started on port::${PORT}`);
  });
}).catch(err => {
    console.log(err)
    //exit process
    process.exit(1)
});

mongoose.set('useFindAndModify', false);

