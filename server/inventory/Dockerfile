FROM node:23
WORKDIR /app
COPY package*.json ./
COPY .env .env
COPY . .
RUN npm install
RUN npx prisma generate
EXPOSE 3002
CMD [ "node" , "index.js" ]
