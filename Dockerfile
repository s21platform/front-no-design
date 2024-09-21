FROM node:14-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .
RUN npm run build


FROM nginx:1.21-alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3001

CMD ["nginx", "-g", "daemon off;"]