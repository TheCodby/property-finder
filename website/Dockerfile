FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./
COPY website/package.json ./website/
COPY database/package.json ./database/

# Install dependencies
RUN yarn install

# Copy source code
COPY . .

# Build database package
RUN yarn db:generate

# Build the website
RUN yarn website:build

# Expose port
EXPOSE 3000

# Start the website
CMD ["yarn", "website:start"] 