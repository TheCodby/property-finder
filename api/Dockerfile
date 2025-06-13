FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./
COPY api/package.json ./api/
COPY database/package.json ./database/

# Install dependencies
RUN yarn install

# Copy source code
COPY . .

# Build database package
RUN yarn db:generate

# Expose port
EXPOSE 3001

# Start the API
CMD ["yarn", "api:dev"] 