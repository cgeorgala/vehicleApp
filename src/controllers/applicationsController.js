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
    $1, $2, $3, $4, $5 )
`;
// status, date_created, date_modified )
// VALUES(
//   $1, $2, $3, $4, $5, $6, $7)

function postNewApplication(req, vehicle_id, callback) 
{
  let applObj = new Application();
  db_pool.query(postApplQuery, 
    [req.body.usr_id, vehicle_id,
     req.body.seller_code, req.body.buyer_code,
     applObj.status/*, date_created, date_modified*/], 
    (err, result) => {
      console.log(err, result);
      if (err) {
        return callback(err, null);
      }
      else{
        return callback(null, result);
      }
  });
}

// Get application by status
const getApplByStatQuery = `
  SELECT
    v.vehicle_num as "vehicleNum",
    a.seller_code as "sellerCode",
    a.buyer_code as "buyerCode",
    a.status as "status",
    a.date_created as "dateCreated",
    a.date_modified as "dateModified"
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
// If seller code was retrived from users.registrationCode
// INNER JOIN users u ON a.usr_id = u.id
// u.registrationCode as "sellerCode", 

function getApplByUser(userId, callback) 
{
  db_pool.query(getApplByUserQuery, [userId], (err, result) => {
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
    a.seller_code as "sellerCode",
    a.buyerCode as "buyerCode",
    a.status as "status",
    a.date_created as "dateCreated",
    a.date_modified as "dateModified"
  FROM applications a 
  INNER JOIN vehicles v ON a.vehicle_id = v.id
  WHERE (v.vehicle_num = $1::character)
`;
// If seller code was retrived from users.registrationCode
// INNER JOIN users u ON a.usr_id = u.id
// u.registrationCode as "sellerCode", 

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