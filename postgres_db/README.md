# README #

# Introduction #

* Vehicle Transfer Application | Postgres component 

# Dockercompose #
## Create docker image for postgres
* docker-compose up --build -d

# Postgres Information #
* Database: vehicle_transfer_db
* Collections: applications, users, vehicles
* username: postgres, password: postges
* port number: 5432

## Launch the psql utility
* psql -d postgres -h localhost -p 5432 -U postgres

## Launch an interactive shell inside our container
* docker exec -it postgres-docker psql -U postgres
* \l --> list all databases
* \c vehicle_db --> connect to vehicle_transfer_db
* \d --> show all tables
* \d applications --> show applications table schema
* SELECT * FROM users;
* SELECT * FROM applications;
* SELECT * FROM vehicles;

## Create docker image
* docker build -f postgres.Dockerfile -t postgres-docker .

## Create container from specific image
* docker run --name postgres-docker -e POSTGRES_PASSWORD=postgres -d -p 5432:5432 postgres

# User accounts #
## Accounts are created during docker-compose up, through init script

## Employee 
* username: mariap | password: maria123
* email: vehicle.app.hua@gmail.com | password: vehicleapp123 
* email: vehicle.app.hua@outlook.com |  password: my_app_user_123


## Citizens 
* User1
* username: ellenk | password: ellen123
* email: vehicle.user.hua@gmail.com | password: vehicleuser123

* User2
* username: giannis | password: giannis123
* email: vehicle.user2.hua@gmail.com | password: vehicleuser123

## Email Accounts created
* vehicle.app.hua@gmail.com / password: vehicleapp123
* vehicle.app.hua@outlook.com / password: vehicleapp123
* vehicle.user.hua@gmail.com / password: vehicleuser123
* vehicle.user2.hua@gmail.com / password: vehicleuser123

