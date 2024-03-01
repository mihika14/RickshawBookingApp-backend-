const mongoose = require('mongoose')

const CustomerData = new mongoose.Schema ({
    name : {type: String , required: true},
    email: {type: String , required: true},
    password: {type: String , required: true}
},
{
    collection: "RegisteredCustomers"
})

module.exports = mongoose.model('RegisteredCustomers' , CustomerData)