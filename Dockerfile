# Этап сборки
FROM node:18 as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Установка правильного API URL для продакшена
ENV VITE_BACKEND_API_URL=http://188.120.243.137:8090/books-api/
ENV VITE_API_URL=http://188.120.243.137:8090/books-api/

RUN npm run build

# Этап продакшена
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Настройка nginx для правильного проксирования
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]