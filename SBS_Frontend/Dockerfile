# FROM node:alpine

# WORKDIR /usr/src/app

# COPY . /usr/src/app

# RUN npm install -g @angular/cli

# RUN npm install

# CMD ["ng", "serve", "--host", "0.0.0.0"]



# Stage 1: Build the Angular application
FROM node:18.13 AS builder

# Set the working directory
WORKDIR /app

# Add the package.json and package-lock.json
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Build the Angular app
RUN npm run build

# Stage 2: Setup Nginx to serve the app
FROM nginx:alpine

# Remove the default server definition
RUN rm /etc/nginx/conf.d/default.conf
RUN chmod 777 /etc/nginx/

# Copy SSL certificates
COPY server.crt /etc/nginx/ssl/server.crt
COPY server.key /etc/nginx/ssl/server.key

# Copy the Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Ensure permissions are correct
RUN chmod 777 /etc/nginx/ssl/server.crt
RUN chmod 777 /etc/nginx/ssl/server.key

# Copy the built app from the previous stage
COPY --from=builder /app/dist/bk-app/browser /usr/share/nginx/html

# Expose HTTPS port
EXPOSE 443

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]