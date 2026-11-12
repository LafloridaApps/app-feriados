# Frontend de intranet

Construcción local desde feriados-app:

```bash
bash deploy/intranet/build.sh <version>
```

La versión se recibe explícitamente; este script no cambia ramas, no crea tags
de Git, no transfiere imágenes y no despliega. La elección de versión y rama
sigue el procedimiento de producción acordado. No se define otra política aquí.

La imagen `image-app-feriados:<version>` usa Nginx en 5173 para respetar el
mapeo existente `8090:5173`. El Nginx del servidor conserva su configuración:
`/feriados/` se envía a `http://192.168.10.49:8090/`, quitando el prefijo.
Vite y React conservan `/feriados/` como ruta pública. Los archivos se sirven
desde la raíz interna y las rutas de React vuelven a index.html. Los assets
inexistentes responden 404. La API se solicita en `/solicitudes/` del mismo
origen y la atiende el Nginx del servidor, no este contenedor.

El Dockerfile y nginx.conf de producción quedan separados y sin cambios.
No se requiere BACKEND_URL ni .env del frontend en el servidor.

El deploy.sh remoto actual consume `image-app-feriados:latest`. Antes de un
futuro despliegue se debe conservar la referencia de la imagen anterior y,
solo en la etapa autorizada de despliegue, asociar latest a la versión aprobada.
Cargar una imagen versionada por sí solo no cambia el contenedor ni latest.
Ejecutar el deploy remoto desde /home/desarrollo/intranet/app-feriados.
El backend se despliega desde /home/desarrollo/intranet/new-solicitudes,
donde se conserva su .env y su volumen. Subir a intranet comprende ambos.
