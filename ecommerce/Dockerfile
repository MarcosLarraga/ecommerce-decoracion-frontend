# Etapa 1: Instalar dependencias y compilar el proyecto
FROM node:20-alpine AS build-stage

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --production=false

COPY . .

RUN npm run build

# Etapa 2: Servir el contenido compilado usando Nginx
FROM nginx:stable-alpine AS production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copiar configuración personalizada (opcional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
