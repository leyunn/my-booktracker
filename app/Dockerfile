FROM node:14-slim
RUN mkdir /app
WORKDIR /app
COPY package.json /app
COPY package-lock.json /app
RUN npm install
COPY . /app

EXPOSE 3000

CMD ["npm", "start"]
