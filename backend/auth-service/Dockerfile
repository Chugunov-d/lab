FROM node:18

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install
COPY . .

# Устанавливаем переменные окружения
ENV PORT=4001

# Команда для запуска приложения
CMD ["node", "src/app.js"]

# Открываем порт
EXPOSE 4001

