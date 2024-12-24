# Базовый образ
FROM node:18

# Рабочая директория
WORKDIR /app

# Установка зависимостей
COPY package.json package-lock.json ./
RUN npm install

# Копирование исходного кода
COPY ./src ./src
COPY .env .env

# Запуск приложения
CMD ["node", "src/app.js"]
EXPOSE 4000
