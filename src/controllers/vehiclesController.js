'use strict';

const fs = require('fs');
const path = require('path');

const { Pool } = require('pg');
const { db }  = require('./config.json');

// Getting password from db-pass.txt file
// This file should be gitignored and chmod chmod protected
const DB_PASS_FILEPATH = path.resolve(path.join(__dirname, './../db-pass.txt'));
const PG_PASSWORD = fs.readFileSync(DB_PASS_FILEPATH, 'utf8').trim();


// Creating a thread pool for querying the database with
const DB_POOL = new Pool({
  host: db.host,
  user: db.user,
  database: db.database,
  password: PG_PASSWORD,
  // max number of clients in the pool
  max: 20,
});

// Get password by username, to login
const GET_PASS_BY_USERNAME = `
  SELECT
    password
  FROM user
  WHERE username = $1::character
`;
function getPassByUsername(usrname) 
{
  DB_POOL.query(GET_PASS_BY_USERNAME, [usrname], (err, result) => {
    if (err) {
      return callback(err, null);
    }
    return callback(null, result.rows);
  });
}

// Get application by status
const GET_APPL_BY_STATUS = `
  SELECT
    v.vehicle_num as "vehicleNum",
    u.registrationCode as "sellerCode",
    a.buyerCode as "buyerCode",
    a.status as "status",
    a.date_created as "dateCreated",
    a.date_modified as "dateModified"
  FROM application a
  INNER JOIN user u ON a.usr_id = u.id
  INNER JOIN vehicle v ON a.vehicle_id = v.id
  WHERE a.status = 'Pending'
`;
function getApplByStatus(callback) 
{
  DB_POOL.query(GET_APPL_BY_STATUS, (err, result) => {
    if (err) {
      return callback(err, null);
    }
    return callback(null, result.rows);
  });
}

// Get application by userId
const GET_APPL_BY_USER_ID = `
  SELECT
    v.vehicle_num as "vehicleNum",
    u.registrationCode as "sellerCode",
    a.buyerCode as "buyerCode",
    a.status as "status",
    a.date_created as "dateCreated",
    a.date_modified as "dateModified"
  FROM application a
  INNER JOIN user u ON a.usr_id = u.id
  INNER JOIN vehicle v ON a.vehicle_id = v.id
  WHERE a.id = $1::uuid
`;
function getApplByUser(userId) 
{
  DB_POOL.query(GET_APPL_BY_USER_ID, [userId], (err, result) => {
    if (err) {
      return callback(err, null);
    }
    return callback(null, result.rows);
  });
}

// Get application information by vehicle number
const GET_APPL_BY_VEHICLE = `
  SELECT
    v.vehicle_num as "vehicleNum",
    u.registrationCode as "sellerCode",
    a.buyerCode as "buyerCode",
    a.status as "status",
    a.date_created as "dateCreated",
    a.date_modified as "dateModified"
  FROM application a
  INNER JOIN user u ON a.usr_id = u.id
  INNER JOIN vehicle v ON a.vehicle_id = v.id
  WHERE (v.vehicle_num = $1::character)
`;

function getApplByVehicle(vehicleNum, callback) {
  DB_POOL.query(GET_APPL_BY_VEHICLE, [vehicleNum], (err, result) => {
    if (err) {
      return callback(err, null);
    }
    return callback(null, result.rows);
  });
}

module.exports = {
  getApplByStatus,
  getApplByUser,
  getApplByVehicle,
  getPassByUsername
}