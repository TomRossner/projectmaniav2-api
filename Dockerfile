# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG NODE_VERSION=20.9.0

FROM node:${NODE_VERSION}-alpine


# Use production node environment by default.
ENV NODE_ENV production


WORKDIR /usr/src/project-mania-v2-api

# Copy the rest of the source files into the image.
COPY package*.json ./

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage a bind mounts to package.json and package-lock.json to avoid having to copy them into
# into this layer.
RUN npm install --include=dev
RUN npm rebuild bcrypt

COPY . .

# Run the application as a non-root user.
# USER node


# Expose the port that the application listens on.
EXPOSE 3001

# Run the application.
CMD [ "npm", "start" ]