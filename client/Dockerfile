FROM node:23
WORKDIR /app
COPY package*.json ./
COPY .env .env
COPY . .
RUN npm install
EXPOSE 9000
CMD [ "npm" , "run", "dev" ]
