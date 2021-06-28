# Use an existing docker image as a base
FROM node:15

# Set environment varibles

# Change working directory
WORKDIR /app

# Copy main server files
COPY ./ ./

# Execute commands inside the container
RUN npm install

# Tell what to do when it starts as a container
CMD ["npm", "start"]
# CMD ["node","app.js"]
# CMD ["uvicorn","main:app","--host","0.0.0.0","--port","8000"]
