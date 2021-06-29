'use strict';

const fs = require('fs');
const path = require('path');

const { Pool } = require('pg');
const { db }  = require('../config/db-config.json');

// Getting password from db-pass.txt file
// This file should be gitignored and chmod chmod protected
const DB_PASS_FILEPATH = path.resolve(path.join(__dirname, './../config/db-pass.txt'));
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

// Adding new vehicle
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

// Get vehicle by vehicle id
const getVehicleByIdQuery = `
  SELECT *
  FROM vehicles
  WHERE id = $1
`;

function getVehiclebyId(vehicleId, callback) 
{
  db_pool.query(getVehicleByIdQuery, 
    [vehicleId], 
    (err, result) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, result.rows);
  });
}

// Edit vehicle information
const updateVehicleQuery = `
  UPDATE vehicles
  SET vehicle_num = $1, certif_date = $2, type = $3
  WHERE id = $4::uuid
`;
function updateVehicle(req, vehId, callback) 
{
  db_pool.query(updateVehicleQuery, 
    [req.body.vehicle_num, req.body.certif_date, req.body.vehicle_type, vehId],
    (err, result) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, result);
  });
}

module.exports = {
  postNewVehicle,
  getVehiclebyNum,
  getVehiclebyId,
  updateVehicle
}