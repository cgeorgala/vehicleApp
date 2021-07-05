# README #

# Introduction #

* Vehicle Transfer Application | Back-end, postgres and email components 

# Setup #

## Install and initialize node
* npm install
* npm start
* separate package.json files for node-server and mail-server

## Install and initialize postgres
* Database: vehicle_transfer_db
* Collections: applications, users, vehicles


# Run in development mode #

Check all possible endpoints in swagger: 
* http://localhost:8000/api-docs/#/
* http://localhost:8000/api

## Users endpoints
* http://localhost:8000/api/users/addUser
* http://localhost:8000/api/users/loginUser

## Applications endpoints
* http://localhost:8000/api/applications/addApplication
* http://localhost:8000/api/applications/findApplicationByStatus
* http://localhost:8000/api/applications/findApplicationById
* http://localhost:8000/api/applications/findApplicationByUser
* http://localhost:8000/api/applications/editApplication

## Vehicles endpoints
* Vehicle endpoints are not accessed directly, but supported through applications endpoints. 
* http://localhost:8000/api/vehicles/addVehicle
* http://localhost:8000/api/vehicles/findVehicle
* http://localhost:8000/api/vehicles/editVehicle

## Email server endpoint
* /notifyUser
* Require: nodemailer
* Service: gmail
* Node server triggers email with required information through endpoint

* Sender: vehicle.app.hua@gmail.com
* Receiver: citizen's registration email

## Accounts created
* vehicle.app.hua@gmail.com / password: vehicleapp123
* vehicle.user.hua@gmail.com / password: vehicleuser123
* vehicle.user2.hua@gmail.com / password: vehicleuser123

# Postgres #
* username: postgres, password: postges
* port number: 5432


# Run the app in production mode #

# Node-server #

## Create docker image from specific Dockerfile and tag it with a name
* docker build -f nodeServer.Dockerfile . --tag node-server

## Create container from specific image
* docker run --name node-server-container -p 8000:8000 -d node-server

## Check that localhost:8000 is reachable
* curl localhost:8000

## Get into container
* docker exec -it node-server-container bash

# Postgres #

## Create container from specific image
* docker run --name postgres-docker -e POSTGRES_PASSWORD=postgres -d -p 5432:5432 postgres

## Launch the psql utility
* psql -d postgres -h localhost ip 5432 -U postgres

## Launch an interactive shell inside our container
* docker exec -it postgres-docker psql -U postgres
* \l --> list all databases
* \c vehicle_db --> connect to vehicle_db
* \d --> show all tables
* \d applications --> show applications table schema
* SELECT * FROM users;
* SELECT * FROM applications;
* SELECT * FROM vehicles;

# Mail server #

## Create docker image from specific Dockerfile and tag it with a name
* docker build -f mailServer.Dockerfile . --tag mail-server

## Create container from specific image
* docker run --name mail-server-container -p 5000:5000 -d mail-server

# Dockercompose #

* docker-compose up --build -d
* docker-compose.yml files
** service db for postgres
** service web for node server
** service mail for mail-server

## Solve Problem 
* proxy: listen tcp 0.0.0.0:5432: bind: address already in use.
* netstat -anp | grep 5432      
unix  2      [ ACC ]     STREAM     LISTENING     19616    -                   /var/run/postgresql/.s.PGSQL.5432
* Solved by running: sudo service postgresql stop
 
# k8s #

## Build images to be uploaded in Github
* docker build -t ghcr.io/cgeorgala/postgres:latest -f postgres.Dockerfile . 
* docker build -t ghcr.io/cgeorgala/node-server:latest -f nodeServer.Dockerfile .
* docker build -t ghcr.io/cgeorgala/mail-server:latest -f mailServer.Dockerfile .

## Handle github token
* sudo vim github-image-repo.txt --> add github token here
* cat /docker-image-repo_token.txt | docker login ghcr.io -u cgeorgala --password-stdin  --> login

## Upload images in Github repo
* docker push ghcr.io/cgeorgala/postgres:latest
* docker push ghcr.io/cgeorgala/node-server:latest
* docker push ghcr.io/cgeorgala/mail-server:latest

## Create secret
* Used for private packages in github
* Name: dockerconfigjson-github-com
* echo cgeorgala:<token> | base64 --> creates <encoded_token>

* echo '{"auths":{"ghcr.io":{"auth":"<encoded_token>"}}}' | microk8s.kubectl create secret generic dockerconfigjson-github-com --type=kubernetes.io/dockerconfigjson --from-file=.dockerconfigjson=/dev/stdin

* Same name is used in deployment yml files, section imagePullSecrets/name

## Create alias for kubectl
* alias k=microk8s.kubectl

## Apply yml files for every component
* k apply -f k8s/db
* k apply -f k8s/node-server
* k apply -f k8s/mail-server

## Delete if needed
* k delete -f k8s/db
* k delete -f k8s/node-server
* k delete -f k8s/mail-server

# Useful k8s commands #

## Check status in k8s
* k get nodes -o wide
* k get pods -o wide
* k get deployments
* k get pvc -o wide
* k get services
* k logs -f <pod_name>

## Connect to postgres, once it is running
* k get services
NAME                    TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)    AGE
kubernetes              ClusterIP   10.152.183.1     <none>        443/TCP    7h15m
pg-cluster-ip-service   ClusterIP   10.152.183.168   <none>        5432/TCP   7m5s

* psql -h 10.152.183.168 -U postgres -p 5432

## Application URL
* https://kspyrou.cloudns.cl/

## Backup URL
* https://christinageo.cloudns.cl/

## DNS hosting
* ClouDNS

## SSL certificate
* zeroSSL

# User accounts #

## Employee 
* username: mariap | password: maria123
* email: vehicle.app.hua@gmail.com | password: vehicleapp123 


## Citizens 
* User1
* username: ellenk | password: ellen123
* email: vehicle.user.hua@gmail.com | password: vehicleuser123

* User2
* username: giannis | password: giannis123
* email: vehicle.user2.hua@gmail.com | password: vehicleuser123

