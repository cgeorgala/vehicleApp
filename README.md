# README #

### Introduction ###

* Vehicle Transfer Application

### Setup ###

* Manually Install node.js
* Manually Install mongodb
** Database: vehicleTranfer
** Collections: applications, users, vehicles

* npm init
* npm install
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
General
* Check if http or https is needed
* How will config.json be visible in db?
* Check volumes

Queries
* remove user_id from usersTable and from auto-incrementing
* In table Applications: add foreign key vehicle_id from table vehicle which is now in comment
* Search for existence before adding user in DB
* Check if vehicle exists before adding in DB, so that DB doesn't crash
* How to retrieve usr_id(ussid) to be filled in automatically when findApplicationBy? from frontend "active login"?
* When will status be 'In progress' inside db? At the time an application is added in table it is 'Pending'
* Where will I perform validation of submitted information? 
- In frontend for validity of digits/letters/length etc
- In backend for duplication of username/email
i.e. If I want to check password or plates validity, this should be done before submitting a form 
* Encrypt password, and store it encrypted
* Before checking password for login, check if user exists in db

Frontend
For citizen:
* What happens during edit of an existing application:
- first search by user to show all applications of current user
- a list is send back and each application has an application_id (it can be hidden from user's display)
- only one application at a time can be selected to edit
- while submitting modified information, application_id needs to be sent back in response
For employee:
* How to review applications:
- first search by status (pending) to show all pending applications
- a list is send back and each application has an application_id (it can be hidden from user's display)
- only one application at a time can be accepted/rejected
- user can select only from Completed/Rejected and then send back status and applcication id in response
