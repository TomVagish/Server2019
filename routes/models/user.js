const mongoose = require('mongoose');
const userSchema  = mongoose.Schema({


   userEmail:{ type: String , require: true, unique: true },
   userPassword: { type: String , require: true},
   userName:{type: String, require: true, unique: true}

});



module.exports =  mongoose.model('User',userSchema);
