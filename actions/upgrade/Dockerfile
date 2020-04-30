FROM node:12

COPY package.json /package.json
RUN yarn
COPY entrypoint.sh /entrypoint.sh
COPY upgrade.js /upgrade.js
ENTRYPOINT ["/entrypoint.sh"]
