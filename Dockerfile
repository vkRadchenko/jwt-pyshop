# Используем базовый образ Node.js для сборки клиентской части
FROM node:latest AS client-build

# Устанавливаем рабочую директорию внутри контейнера для клиентской части
WORKDIR /app/client

# Копируем файлы package.json и package-lock.json для установки зависимостей клиентской части
COPY client/package*.json ./

# Устанавливаем зависимости для клиентской части
RUN npm install

# Копируем остальные файлы проекта клиента в контейнер
COPY client .

# Собираем клиентскую часть проекта
RUN npm run build

# Создаем новый этап с минимальным образом Node.js для серверной части
FROM node:latest AS server-build

# Устанавливаем рабочую директорию для серверной части
WORKDIR /app/server

# Копируем файлы package.json и package-lock.json для установки зависимостей серверной части
COPY server/package*.json ./

# Устанавливаем зависимости для серверной части
RUN npm install --only=production

# Копируем скомпилированные файлы клиентской части из предыдущего этапа
COPY --from=client-build /app/client/dist /app/server/client/

# Копируем остальные файлы проекта сервера в контейнер
COPY server .

RUN npm run build

# Открываем порт, на котором работает ваше приложение Nest.js
EXPOSE 9090

# Команда запуска серверной части приложения
CMD ["node", "dist/src/main"]
