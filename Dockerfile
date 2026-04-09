FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN cp src/infrastructure/notifications/tandamex-firebase-adminsdk-.json dist/src/infrastructure/notifications/

EXPOSE 3000

CMD ["npm", "start"]