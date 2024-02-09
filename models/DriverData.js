const mongoose = require('mongoose')

const DriverData = new mongoose.Schema (
    {
        name : { type: String , required: true},
        email : { type: String , required: true},
        password : { type: String , required: true},
        telno : { type: Number , required: true},
        age : { type: Number , required: true},

    },
    {
        collection: "Registereddrivers"
    }
)

module.exports = mongoose.model('Registereddrivers', DriverData)