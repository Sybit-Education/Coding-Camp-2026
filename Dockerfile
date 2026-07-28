FROM node:lts AS build-stage

WORKDIR /app

COPY package*.json ./
RUN npm ci --ignore-scripts

COPY . .
RUN npm run build

FROM nginx:stable AS production-stage

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*

COPY --from=build-stage /app/dist/ .

COPY docker/nginx/nginx.conf /etc/nginx

EXPOSE 80