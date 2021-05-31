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

const postVehicleQuery = `
  INSERT INTO vehicles (
    vehicle_num, certif_date, type )
  VALUES(
    $1, $2, $3)
`;

function postNewVehicle(req, callback) 
{
  db_pool.query(postVehicleQuery, 
    [req.body.vehicle_num, req.body.certif_date, req.body.vehicle_type], 
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

// Get vehicle by vehicle plates number
const getVehicleQuery = `
  SELECT id
  FROM vehicles
  WHERE vehicle_num = $1
`;

function getVehiclebyNum(vehicleNum, callback) 
{
  db_pool.query(getVehicleQuery, 
    [vehicleNum], 
    (err, result) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, result);
  });
}

// Edit vehicle
const putVehicleQuery = `
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
function putVehicle(putVehicleQuery) 
{
  DB_POOL.query(GET_APPL_BY_STATUS, (err, result) => {
    if (err) {
      return callback(err, null);
    }
    return callback(null, result.rows);
  });
}

module.exports = {
  postNewVehicle,
  getVehiclebyNum,
  putVehicle
}