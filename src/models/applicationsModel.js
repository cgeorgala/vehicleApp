const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const applicationsSchema = new Schema(
{
    appID: Number,
    employeeID: Number,
    sellerID: Number,
    dateCreated: String,
    dateModified: String,
    sellerCode: Number,
    buyerCode: Number,
    vehicleNum: Number,
    status: String
})

module.exports = applicationsSchema;