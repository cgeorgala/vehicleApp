# README #

### Introduction ###

* Vehicle Transfer Application

### Setup ###

* Manually Install node.js
* Manually Install postgres
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
Docker
* Do I need wait-for-it?

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

### Dockerize ###
* docker pull node

# Create docker image from specific Dockerfile and tag it with a name
* docker build -f nodeServer.Dockerfile . --tag node-server

# Create container from specific image
* docker run --name node-server-container -p 8000:8000 -d node-server

# Check that localhost:8000 is reachable
* curl localhost:8000

# Get into container
* docker exec -it node-server-container bash

# Stop running container
* docker stop a9f0469aa1b3 -t 0

# Remove stopped container
docker rm node-server-container

# Remove docker image
docker image rm node-server
or
* docker rmi <repo:tag>

# Postgres
* docker pull postgres
* there is is postgres docker image in dockerhub
* docker run --name postgres-docker -e POSTGRES_PASSWORD=postgres -d -p 5432:5432 postgres

# Launch the psql utility
* psql -d postgres -h localhost ip 5432 -U postgres

# Launch an interactive shell inside our container
* docker exec -it postgres-docker psql -U postgres
* docker exec -it 91ffbda369d1  psql -U postgres

* \l --> list all databases
* \c vehicle_db --> connect to vehicle_db
* \d --> show all tables
* \d applications --> show applications table schema
* SELECT * FROM applications; --> show contents BUT run first \d table_name
* SELECT * FROM vehicles;

##### IMPORTANT ####
In order app container to talk with db container, in config.json of application  use 
{
    "db": {
      "host": "localhost", <---- use "db" for containers
      "user": "postgres",
      "database": "vehicle_transfer_db"
    }
  }

#Inspect the volume
docker volume inspect vehiclestransferapp_postgres_data
ls /var/lib/docker/volumes/postgres-data/_data/

#delete a volume to get changes in volumes
docker volume rm vehiclestransferapp_postgres_data

## Dockercompose in order not to create manually separately docker containers

* docker-compose up -d
* docker-compose down --> stop and deletes containers

* docker-compose up --build -d --> build again the images if something has changed

# check postgres tables through postgres container
* psql -p 4321 -d docker -U postgres
\d
\dt
select * from users

# GET
* curl localhost:8000/

#POST user with curl command
curl --location --request POST 'http://localhost:8000/users/addUser' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'first_name=Chris' \
--data-urlencode 'last_name=Geo' \
--data-urlencode 'email=itp1234@hua.com' \
--data-urlencode 'username=chrischris' \
--data-urlencode 'password=1234' \
--data-urlencode 'role=citizen' \
--data-urlencode 'registrationCode=123456'

# Check volumes
* docker volume ls ---> vehiclestransferapp_postgres_data

## Problem proxy: listen tcp 0.0.0.0:5432: bind: address already in use.
netstat -anp | grep 5432      
unix  2      [ ACC ]     STREAM     LISTENING     19616    -                   /var/run/postgresql/.s.PGSQL.5432
Solution: sudo service postgresql stop
 
# k8s
sudo snap install microk8s --classic
sudo usermod -a -G microk8s $USER
sudo chown -f -R $USER ~/.kube
su - $USER

microk8s.enable dashboard dns storage ingress
microk8s.status

sudo ufw allow in on eth0 && sudo ufw allow out on eth0
sudo ufw default allow routed

alias k=microk8s.kubectl
k get pods
k get nodes
k get nodes -o wide
k get pods -o wide
k get deployments
k get pvc -o wide
k get services

k create -f postgres-configmap.yaml     --> configmap/postgres-config created
k create -f postgres-pvc.yml            --> persistentvolumeclaim/pg-pvc-claim created
k create -f postgres-deployment.yml     --> deployment.apps/postgresdb created
k create -f postgres-clip.yml           --> service/pg-cluster-ip-service created

## Connect to PostgreSQL database, once it is running.
k get services
NAME                    TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)    AGE
kubernetes              ClusterIP   10.152.183.1     <none>        443/TCP    7h15m
pg-cluster-ip-service   ClusterIP   10.152.183.168   <none>        5432/TCP   7m5s

psql -h 10.152.183.168 -U postgres -p 5432

k delete service pg-cluster-ip-service
k delete deployment postgresdb
k delete persistentvolumeclaim pg-pvc-claim
k delete configmap postgres-config

k create configmap pg-init-script --from-literal=init.sql="$(curl -fsSL https://bitbucket.org/christinageo/vehiclestransferapp/src/master/db/init.sql)"  --> configmap/pg-init-script created



