FROM alpine:latest

RUN apk add --no-cache bash git sed
COPY version.sh /version.sh

ENTRYPOINT ["/version.sh"]
