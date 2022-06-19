# Use an existing docker image as a base
FROM postgres:13

# Change working directory
WORKDIR /pg-db

# Copy main db files
# COPY ./db/* ./db/

ENV POSTGRES_USER postgres
ENV POSTGRES_PASSWORD postgres
ENV POSTGRES_DB vehicle_transfer_db

# Copy initialization file
COPY ./init.sql /docker-entrypoint-initdb.d/