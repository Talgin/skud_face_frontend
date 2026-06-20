
FROM node:18-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

ARG PUBLIC_API_BASE_URL=/api/v1
ENV PUBLIC_API_BASE_URL=${PUBLIC_API_BASE_URL}

COPY . .
RUN npm run build

FROM nginx:alpine

RUN apk add --no-cache gettext

RUN rm -f /etc/nginx/nginx.conf
COPY ci/nginx.conf.template /etc/nginx/nginx.conf.template

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["/bin/sh", "-c", "envsubst '${SERVER_IP}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf && nginx -g 'daemon off;'"]
