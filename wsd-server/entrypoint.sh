#!/bin/sh

envsubst "$(env | sed -e 's/=.*//' -e 's/^/\$/g')" < /wsd-server/template.nginx.conf > /wsd-server/nginx.conf

exec nginx -c /wsd-server/nginx.conf -g 'daemon off;'
