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

// TODO: Maybe check first if  user already exists
// const postUsrQuery = `
//   IF NOT EXISTS (SELECT * FROM users WHERE username=$5)
//   BEGIN
//     INSERT INTO users (
//       user_id, first_name, last_name, 
//       email, username, password,
//       role, position, registrationCode )
//     VALUES(
//       $1, $2, $3, $4, $5, $6, $7, $8, $9
//     )
//   END
// `;

// POST in users table, to register new user
//TODO: check what happens in latestId when application Server restarts
class User 
{
  constructor() {
    this.usrId = User.incrementId();
  }
  static incrementId() 
  {
    if (!this.latestId) {
      this.latestId = 1;
    }
    else {
      this.latestId++;
    }
    return this.latestId;
  }
};

const postUsrQuery = `
  INSERT INTO users (
    user_id, first_name, last_name, 
    email, username, password,
    role, position, registrationCode )
  VALUES(
    $1, $2, $3, $4, $5, $6, $7, $8, $9 )
`;

function postNewUser(req, callback) 
{
  let userObj = new User();
  db_pool.query(postUsrQuery, 
    [userObj.usrId,req.body.first_name, req.body.last_name, 
    req.body.email, req.body.username, req.body.password, 
    req.body.role, req.body.position, req.body.registrationCode], 
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

// Get password by username, to login
//TODO: add user authentication
const getPassQuery = `
  SELECT
    password
  FROM users
  WHERE username = $1
`;
function getPassByUsername(req, callback)
{
  db_pool.query(getPassQuery, 
    [req.body.username], 
    (err, result) => {
      if (err) {
        return callback(err, null);
      }
      if (req.body.password === result.rows[0].password)
      {
        console.log(`Password is correct`); 
        result.status = 200;
      }
      else
      {
        console.log(`Wrong password`);
        result.status = 404; 
      }
      return callback(null, result);
  });
}

module.exports = {
  postNewUser,
  getPassByUsername
}