FROM node:18-bullseye

WORKDIR /usr/app
COPY . .

RUN npm install
RUN npm run pg

ARG PORT 80

EXPOSE 80
CMD ["npm", "run", "start"]
