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
    // this.status = 'In Progress'; When is application In progress?
    this.status = 'Pending';
  }
}

const postApplQuery = `
  INSERT INTO applications (
    usr_id, vehicle_id, seller_code, buyer_code, 
    status)
  VALUES(
    $1, $2, $3, $4, $5 ) RETURNING *
`;

function postNewApplication(req, vehicle_id, callback) 
{
  let applObj = new Application();
  db_pool.query(postApplQuery, 
    [req.body.usr_id, vehicle_id,
     req.body.seller_code, req.body.buyer_code,
     applObj.status], 
    (err, result) => {
      console.log(err, result);
      if (err) {
        return callback(err, null);
      }
      else{
        console.log(result.rows);
        return callback(null, result);
      }
  });
}

// Get application by status
const getApplByStatQuery = `
  SELECT
    a.id as "applicationId",
    v.vehicle_num as "vehicleNum",
    a.seller_code as "sellerCode",
    a.buyer_code as "buyerCode",
    a.status as "status",
    a.date_created as "dateCreated",
    a.date_modified as "dateModified",
    v.type as "vehicleType"
  FROM applications a
  INNER JOIN vehicles v ON a.vehicle_id = v.id
  WHERE a.status = $1
`;
// If seller code was retrived from users.registrationCode
// INNER JOIN users u ON a.usr_id = u.id
// u.registrationCode as "sellerCode", 
function getApplByStatus(applStatus, callback) 
{
  db_pool.query(getApplByStatQuery, [applStatus], (err, result) => {
    if (err) {
      return callback(err, null);
    }
    return callback(null, result.rows);
  });
}

// Get application by userId
const getApplByUserQuery = `
  SELECT
    a.id as "applicationId",
    v.vehicle_num as "vehicleNum",
    a.seller_code as "sellerCode",
    a.buyer_code as "buyerCode",
    a.status as "status",
    a.date_created as "dateCreated",
    a.date_modified as "dateModified"
  FROM applications a
  INNER JOIN vehicles v ON a.vehicle_id = v.id
  WHERE a.usr_id = $1::uuid
`;

function getApplByUser(userId, callback) 
{
  db_pool.query(getApplByUserQuery, [userId], (err, result) => {
    if (err) {
      return callback(err, null);
    }
    return callback(null, result.rows);
  });
}


// Get application by userId
const getApplByIdQuery = `
  SELECT
    a.id as "applicationId",
    v.vehicle_num as "vehicleNum",
    a.seller_code as "sellerCode",
    a.buyer_code as "buyerCode",
    a.status as "status",
    a.date_created as "dateCreated",
    a.date_modified as "dateModified",
    v.certif_date as "certificateDate",
    v.type as "vehicleType",
    u.first_name as "sellerFirstName",
    u.last_name as "sellerLastName"
  FROM applications a
  INNER JOIN vehicles v ON a.vehicle_id = v.id
  INNER JOIN users u ON u.id = a.usr_id
  WHERE a.id = $1::uuid
`;

function getApplById(applicationId, callback) 
{
  db_pool.query(getApplByIdQuery, [applicationId], (err, result) => {
    if (err) {
      console.log(err);
      return callback(err, null);
    }
    return callback(null, result.rows);
  });
}

// Get vehicleId by ApplicationId
const getVehicleIdByApplId = `
  SELECT
    id as "applId",
    vehicle_id as "vehicleId",
    status as "applStatus"
  FROM applications
  WHERE id = $1::uuid
`;

function getVehicleIdByApplicationId(req, callback) 
{
  db_pool.query(getVehicleIdByApplId, [req.body.appl_id], 
    (err, result) => {
    if (err) {
      return callback(err, null);
    }
    return callback(null, result.rows);
  });
}

// Edit application information
const updateApplQuery = `
  UPDATE applications
  SET seller_code = $1, buyer_code = $2, status = $3, date_modified = $4
  WHERE id = $5  RETURNING *
`;

function editExistApplication(req, callback)
{
  let status = 'Pending';
  let mod_date = new Date();
  db_pool.query(updateApplQuery, 
    [req.body.seller_code, req.body.buyer_code, status, mod_date, req.body.appl_id], 
    (err, result) => {
    if (err) {
      return callback(err, null);
    }
    return callback(null, result);
  });
}

// Edit application status to Completed/Rejected
const updateApplStatusQuery = `
  UPDATE applications
  SET status = $1, date_modified = $2
  WHERE id = $3
`;

function editApplicationStatus(req, callback)
{
  let mod_date = new Date();
  db_pool.query(updateApplStatusQuery, 
    [req.body.status, mod_date, req.body.applId], 
    (err, result) => {
    if (err) {
      return callback(err, null);
    }
    return callback(null, result);
  });
}

// Get application information by vehicle number
const getApplByVehicle = `
  SELECT
    a.id as "applicationId",
    v.vehicle_num as "vehicleNum",
    a.seller_code as "sellerCode",
    a.buyer_code as "buyerCode",
    a.status as "status",
    a.date_created as "dateCreated",
    a.date_modified as "dateModified"
  FROM applications a 
  INNER JOIN vehicles v ON a.vehicle_id = v.id
  WHERE v.vehicle_num = $1
`;

function getApplicationByVehicle(req, callback)  //not used yet
{
  db_pool.query(getApplByVehicle, [vehicleNum], (err, result) => {
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
  getApplById,
  getVehicleIdByApplicationId,
  editExistApplication,
  editApplicationStatus,
  getApplicationByVehicle //not used yet
}