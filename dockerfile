# Use the official Node.js LTS image
FROM node:current-alpine
# Set working directory
WORKDIR /app
# Copy package.json and package-lock.json
COPY package*.json ./
# Install dependencies
RUN npm install --omit=dev
# Copy the rest of the application code
COPY . .
# Expose the port your Express app runs on
EXPOSE 3000
# Start the application
CMD ["npm", "run", "start"]