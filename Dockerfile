FROM node:16-alpine

# Script arguments with default values
ARG NODE_ENV="production"

# Add arguments above to docker environment
ENV NODE_ENV=$NODE_ENV

# install curl for healthchecks
RUN apk --no-cache add curl

WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm --production=false install
COPY . .
RUN npm run build

# RUN echo "#!/bin/sh\n\
#     npm run build:dev && \
#     npm run start:dev" > /app/run.sh

EXPOSE 3001
CMD ["npm", "run", "start:dev"]
