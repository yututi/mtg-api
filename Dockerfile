FROM node:18-bullseye

WORKDIR /app
COPY . .

RUN npm i
RUN npm run pg

ARG PORT 80

EXPOSE 80
CMD ["npm", "run", "start"]
