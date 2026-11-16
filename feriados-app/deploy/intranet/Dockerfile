FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# An empty base URL makes API requests use the public origin (/solicitudes/).
ENV VITE_API_BASE_URL=""
ARG VITE_MAIN_MENU_URL="https://intranet.laflorida.cl/home"
ENV VITE_MAIN_MENU_URL=$VITE_MAIN_MENU_URL
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY deploy/intranet/nginx.conf /etc/nginx/conf.d/default.conf
# Nginx necesita escribir su PID y cachés; el puerto 5173 no requiere root.
RUN chown -R nginx:nginx /var/cache/nginx \
    && sed -i 's@^pid[[:space:]].*;@pid /tmp/nginx.pid;@' /etc/nginx/nginx.conf \
    && grep -q '^pid /tmp/nginx.pid;' /etc/nginx/nginx.conf
USER nginx
EXPOSE 5173
CMD ["nginx", "-g", "daemon off;"]
