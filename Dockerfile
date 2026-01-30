FROM node:20-alpine

WORKDIR /app

# Install build tools for bcrypt
RUN apk add --no-cache python3 make g++ libc6-compat

COPY package*.json ./
#RUN npm ci --only=production

# Force bcrypt to build from source 
RUN npm install --production --build-from-source=bcrypt

COPY . .


EXPOSE 3000
CMD ["node", "src/server.js"]
