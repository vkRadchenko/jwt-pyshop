# Используем базовый образ Node.js для сборки клиентской части
FROM node:latest AS client-build

# Устанавливаем рабочую директорию внутри контейнера для клиентской части
WORKDIR /usr/src/app/client

# Копируем файлы package.json и package-lock.json для установки зависимостей клиентской части
COPY client/package*.json ./

# Устанавливаем зависимости для клиентской части
RUN npm install

# Копируем остальные файлы проекта клиента в контейнер
COPY client .

# Собираем клиентскую часть проекта
RUN npm run build


FROM node:20-alpine AS build

WORKDIR /usr/src/app/server

COPY server/package*.json ./

RUN npm install

COPY server .

RUN npm run build


# Создаем новый этап с минимальным образом Node.js для серверной части
FROM node:20-alpine

# Устанавливаем рабочую директорию для серверной части
WORKDIR /usr/src/app

COPY --from=build /usr/src/app/server/dist ./dist

# Копируем файлы package.json и package-lock.json для установки зависимостей серверной части
COPY server/package*.json ./

# Устанавливаем зависимости для серверной части
RUN npm install --only=production

# Копируем скомпилированные файлы клиентской части из предыдущего этапа
COPY --from=client-build /usr/src/app/client/dist ./client

# Копируем остальные файлы проекта сервера в контейнер
COPY server .

# Открываем порт, на котором работает ваше приложение Nest.js
EXPOSE 9090

# Команда запуска серверной части приложения
CMD ["node", "dist/src/main"]
