FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build:web

EXPOSE 3000

CMD ["npm", "run", "start", "--workspace", "@automationhub/web"]
