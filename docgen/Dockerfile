FROM node:12

RUN apt-get update && apt-get install -y rsync jq vim

WORKDIR /home/node/work
COPY package.json /home/node/work
RUN npm install
RUN sed -i'' -e 's/Globals/{{name}}/' node_modules/typedoc-default-themes/bin/default/partials/breadcrumb.hbs

COPY clone.sh /home/node/work
COPY docgen.sh /home/node/work
COPY prep_docgen.js /home/node/work

ENTRYPOINT ["/home/node/work/docgen.sh"]
