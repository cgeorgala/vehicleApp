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

