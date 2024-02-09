const mongoose = require('mongoose');

const DriverLocation = new mongoose.Schema(
    {
        latitude: {
            type: Number,
            required: true,
            min: -90,
            max: 90
        },
        longitude: {
            type: Number,
            required: true,
            min: -180,
            max: 180
        },
        startTiming:{
            type: String,
            required:true
        },
        endTiming:{
            type: String,
            required:true
        }
    },
    {
        collection: "LocationDrivers"
    }
);

module.exports = mongoose.model('LocationDrivers', DriverLocation);
