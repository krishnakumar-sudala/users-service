FROM node:20-alpine

WORKDIR /app

# Install build tools for bcrypt
RUN apk add --no-cache python3 make g++ libc6-compat

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm rebuild bcrypt --build-from-source


EXPOSE 3000
CMD ["node", "src/server.js"]
