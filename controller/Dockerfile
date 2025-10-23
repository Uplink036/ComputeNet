FROM node:22-alpine

ENV PORT=3000 
ENV DATABASE_URL=mongodb://localhost:27017

WORKDIR /app

COPY package.json .
RUN npm install

COPY . .

EXPOSE $PORT
CMD ["npm", "run", "dev"]
