FROM node:10

# install google-chrome-stable
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list \
  && apt-get update -qqy \
  && apt-get -qqy install \
    ${CHROME_VERSION:-google-chrome-stable} \
  && rm /etc/apt/sources.list.d/google-chrome.list \
  && rm -rf /var/lib/apt/lists/* /var/cache/apt/*

# Avoid script node binary mismatch output
# https://github.com/nodenv/nodenv/issues/108
RUN npm config set scripts-prepend-node-path auto

# Use version of yarn (as of Dockerfile build)
RUN npm install -g yarn

RUN git config --global user.email "uirouter@github.actions"
RUN git config --global user.name "uirouter github actions"
