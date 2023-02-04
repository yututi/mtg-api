FROM node:18-bullseye

WORKDIR /app

RUN npm i
RUN npm run pg

COPY . .

ARG PORT 80

EXPOSE 80
CMD ["npm", "run", "start"]
