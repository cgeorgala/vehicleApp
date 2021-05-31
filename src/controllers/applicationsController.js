'use strict';

const fs = require('fs');
const path = require('path');

const { Pool } = require('pg');
const { db }  = require('../config.json');

// Getting password from db-pass.txt file
// This file should be gitignored and chmod chmod protected
const DB_PASS_FILEPATH = path.resolve(path.join(__dirname, './../db-pass.txt'));
const PG_PASSWORD = fs.readFileSync(DB_PASS_FILEPATH, 'utf8').trim();


// Creating a thread pool for querying the database with
const db_pool = new Pool({
  host: db.host,
  user: db.user,
  database: db.database,
  password: PG_PASSWORD,
  // max number of clients in the pool
  max: 20,
});

class Application 
{
  constructor() {
    // this.date_created = Date.now();
    // this.date_modified = Date.now();
    this.status = 'In Progress';
  }
}

const postApplQuery = `
  INSERT INTO applications (
    usr_id, vehicle_id, seller_code, buyer_code, 
    status)
  VALUES(
    $1, $2, $3, $4, $5 )
`;
// status, date_created, date_modified )
// VALUES(
//   $1, $2, $3, $4, $5, $6, $7)

function postNewApplication(req, data, callback) 
{
  let applObj = new Application();
  db_pool.query(postApplQuery, 
    [req.body.usr_id, data.id/*vehicle id*/,
     req.body.sellerCode, req.body.buyerCode,
     applObj.status/*, applObj.date_created, applObj.date_modified*/], 
    (err, result) => {
      console.log(err, result);
      if (err) {
        return callback(err, null);
      }
      else{
        return callback(null, userObj.usrId);
      }
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
  db_pool.query(GET_APPL_BY_STATUS, (err, result) => {
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
  db_pool.query(GET_APPL_BY_USER_ID, [userId], (err, result) => {
    if (err) {
      return callback(err, null);
    }
    return callback(null, result.rows);
  });
}

// GET application information by vehicle number
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
  db_pool.query(GET_APPL_BY_VEHICLE, [vehicleNum], (err, result) => {
    if (err) {
      return callback(err, null);
    }
    return callback(null, result.rows);
  });
}

module.exports = {
  postNewApplication,
  getApplByStatus,
  getApplByUser,
  getApplByVehicle,
}