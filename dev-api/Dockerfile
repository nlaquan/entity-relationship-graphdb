FROM node:13

RUN mkdir /home/node/ergraphdb-dev-api && chown -R node:node /home/node/ergraphdb-dev-api

# Create app directory
WORKDIR /home/node/ergraphdb-dev-api

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

USER node

RUN yarn install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY --chown=node:node . .

EXPOSE 3001

CMD [ "yarn", "start" ]
