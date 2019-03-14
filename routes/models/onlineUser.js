const mongoose = require('mongoose');

const onlineUserSchema  = mongoose.Schema({

   userName:{ type: String , require: true},
   room: { type: String , require: true},

});

module.exports =  mongoose.model('onlineUser',onlineUserSchema);
