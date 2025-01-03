FROM nginx:1.27.2-alpine

WORKDIR /wsd-server

COPY . /wsd-server/

RUN chmod +x /wsd-server/entrypoint.sh

ENTRYPOINT ["/wsd-server/entrypoint.sh"]
