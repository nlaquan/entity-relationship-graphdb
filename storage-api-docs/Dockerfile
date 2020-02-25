FROM node:13

RUN mkdir /home/node/ergraphdb-dev-api-docs && chown -R node:node /home/node/ergraphdb-dev-api-docs

# Create app directory
WORKDIR /home/node/ergraphdb-dev-api-docs

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

EXPOSE 3000

CMD [ "yarn", "start" ]
