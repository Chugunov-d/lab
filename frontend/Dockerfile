# Базовый образ
FROM node:18

# Рабочая директория
WORKDIR /app

# Установка зависимостей
COPY package.json package-lock.json ./
RUN npm install

# Копируем исходный код
COPY . .

# Сборка приложения
RUN npm run build

# Сервер для статических файлов
RUN npm install -g serve
CMD ["serve", "-s", "dist"]

EXPOSE 3000
