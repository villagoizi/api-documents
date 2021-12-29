FROM node:16.13.0 AS document-dev
WORKDIR /home/node/app
COPY package*.json ./
RUN npm install glob rimraf
RUN npm install --only=development
COPY . .
RUN npm run build

FROM node:16-alpine as document-prod
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /home/node/app
COPY package*.json ./
RUN npm install --only=production
COPY . .
COPY --from=document-dev /home/node/app/dist ./dist
CMD ["node", "dist/main"]