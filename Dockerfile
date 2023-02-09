FROM node:18-bullseye

WORKDIR /app
COPY . .

RUN npm ci
RUN npm run pg

ENV PORT 80

EXPOSE 80
CMD ["npm", "run", "start"]
