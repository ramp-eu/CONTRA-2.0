FROM node:10.16.0
COPY . /opt/dih
WORKDIR /opt/dih
RUN chown -R node:node /opt/dih
USER node
RUN npm install
ENTRYPOINT ["npm", "start"]
