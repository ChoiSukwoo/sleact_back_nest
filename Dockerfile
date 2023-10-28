# Use the official Node.js 18 image as the base image
FROM node:18

# Create a directory for your application in the container
RUN mkdir -p /var/app

# Set the working directory
WORKDIR /var/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire application to the container
COPY . .

# Build the NestJS application
RUN npm run build

# Expose the port that your NestJS application will run on
EXPOSE 3000

# Command to run the application
CMD [ "node", "dist/src/main.js" ]