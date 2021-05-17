const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const vehiclesSchema = new Schema(
{
    vehicleID: Number,
    vehicleNum: Number,
    certificateDate: String,
    type: String
})

module.exports = vehiclesSchema;