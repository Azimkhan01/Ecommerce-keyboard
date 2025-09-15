FROM node:23
WORKDIR /app
COPY package*.json ./
COPY . .
COPY .env .env
RUN npm install
EXPOSE 3001
CMD [ "node", "index.js" ]