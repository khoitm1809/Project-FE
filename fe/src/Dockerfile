# Sử dụng node để build app
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Sử dụng nginx để serve file tĩnh
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# Mở port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
