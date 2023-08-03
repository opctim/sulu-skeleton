FROM nginx:1.21-alpine

RUN echo "alias ll='ls -lah'" >> /etc/profile && cp /etc/profile /root/.bashrc

ENV ENV="/etc/profile"

RUN apk update && apk add openssl bash && \
    mkdir -p /certs && \
    openssl req -x509 --subj '/CN=SymfonyCorp /C=US' -nodes -days 1825 -newkey rsa:2048 -keyout /certs/nginx.key -out /certs/nginx.crt

COPY nginx.conf  /etc/nginx/
COPY ssl.conf /etc/nginx/conf.d/

COPY templates /etc/nginx/templates/

RUN echo "upstream php-upstream { server php:9000; }" > /etc/nginx/conf.d/upstream.conf

EXPOSE 80
EXPOSE 443
