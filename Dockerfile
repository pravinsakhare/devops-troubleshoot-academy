FROM node:18-alpine

# Install kubectl and bash
RUN apk add --no-cache kubectl bash curl

# Set working directory
WORKDIR /app/backend

# Install dependencies if you have package.json
# COPY package*.json ./
# RUN npm install

# Start the server
CMD ["node", "terminal-server.js"]