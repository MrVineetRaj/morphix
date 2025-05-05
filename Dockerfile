# load basefile
# Use the specific Node.js version v22.14.0 with Alpine
FROM node:22.14-alpine AS base

# Set the working directory in the container
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
# Using npm install for development. For production, consider npm ci.
RUN npm install

# Copy the rest of your application code into the container
COPY . .

# EXPOSE one port : 3000
# This informs Docker that the container listens on this port
EXPOSE 3000

# run project using npm run dev
# This command will be executed when the container starts
CMD ["npm", "run", "dev"]