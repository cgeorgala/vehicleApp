# README #

### Introduction ###

* Vehicle Transfer Application

### Setup ###

* Manually Install node.js
* Manually Install mongodb
** Database: vehicleTranfer
** Collections: applications, users, vehicles

* npm init
* npm start

### How to run ###

Check all possible endpoints in swagger: 
* http://localhost:8000/api-docs/#/

Available "GET" endpoints:
* Home page http://localhost:8000/
* Register page http://localhost:8000/users/addUser
* Login page http://localhost:8000/users/loginUser
* http://localhost:8000/users/logoutUser
* http://localhost:8000/vehicles/findVehicle
* http://localhost:8000/applications/findApplicationByStatus
* http://localhost:8000/applications/findApplicationByUser


### Useful information ###
Postgres
* superuser/ postgres
* port number the server listens on: 5432

### Open issues ###
* In table Applications: add foreign key vehicle_id from table vehicle which is now in comment
* Search for existence before adding user in DB
* Check if http or https is needed
* How will config.json be visible in db?
* Check if vehicle exists before adding in DB, so that DB doesn't crash
* Response is not sent back when calling endpoint /addApplication
* How to retrieve usr_id(ussid) to be filled in automatically? from frontend "active login"?
* When will status be 'In progress' inside db? At the time an application is added in table it is 'Pending'