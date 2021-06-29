# Use an existing docker image as a base
FROM node:15

# Set environment varibles

# Change working directory
WORKDIR /server

# Copy main server files
COPY ./server ./

# Execute commands inside the container
RUN npm install

# Tell what to do when it starts as a container
CMD ["npm", "start"]