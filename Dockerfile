FROM node:20-alpine AS builder

RUN npm install -g @nestjs/cli

WORKDIR /app
COPY . .

RUN npm install --production

RUN npm run build

CMD ["npm", "run", "start:prod"]




