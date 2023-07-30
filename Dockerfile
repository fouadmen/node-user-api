FROM node:lts

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

COPY ./migrations ./

RUN chmod +x docker-entrypoint.sh

EXPOSE 8080

CMD ["./docker-entrypoint.sh"]