FROM node:20-alpine

# Create app directory
WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm ci --only=production

# Copy the rest of the service
COPY . .

# Expose service port
EXPOSE 3000

# Run the service
CMD ["node", "src/server.js"]
