# Usa una imagen oficial de Node.js LTS para construir la app
FROM node:20-alpine AS build

# Establece el directorio de trabajo
WORKDIR /app

# Copia dependencias
COPY package.json package-lock.json ./

# Instala dependencias (modo producción)
RUN npm install --production=false

# Copia el resto del código fuente
COPY . .

# Compila la aplicación para producción
RUN npm run build

# Usa una imagen liviana como servidor web estático
FROM nginx:stable-alpine

# Copia la build al servidor web de nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copia configuración personalizada de nginx (opcional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expón el puerto estándar HTTP
EXPOSE 80

# Arranca nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]