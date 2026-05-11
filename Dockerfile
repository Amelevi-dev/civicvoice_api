# Use official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install production dependencies only
RUN npm install --omit=dev

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3005

# Define environment variables (should be overridden by .env or VPS environment)
ENV PORT=3005
ENV NODE_ENV=production

# Start the application
CMD ["node", "server.js"]