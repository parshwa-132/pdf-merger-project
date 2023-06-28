// Using Node.js `require()`
const mongoose = require('mongoose');

mongoose.set('strictQuery', false);


const connectionParams={
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true 
} 
const url =  "mongodb+srv://smartparshwa32:WweeOmcLJH0DmeQ3@cluster0.gc0a75b.mongodb.net/pdf-merge?retryWrites=true&w=majority"
const connection =mongoose
  .connect( url, connectionParams
   
)
  .then(() => {
    console.log(`Connected To Database and listening on port ${3000}.`);
  })
  .catch((err) => console.log('error:',err));   
  
  module.exports = connection
