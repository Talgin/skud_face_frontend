
FROM node:18-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

ARG PUBLIC_API_BASE_URL
ENV PUBLIC_API_BASE_URL=${PUBLIC_API_BASE_URL}

COPY . .
RUN npm run build

FROM nginx:alpine

RUN rm -f /etc/nginx/nginx.conf
COPY ci/nginx.conf /etc/nginx/nginx.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

# ["nginx", "-g", "daemon off;"]
